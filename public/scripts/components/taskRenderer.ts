import { Task } from '../models/taskModel';
import { columns } from '../models/columnModel';
import { setupTaskDragAndDrop, removeTaskDragAndDrop } from '../utils/dragAndDrop';
import { patchTaskTitle, patchTaskDescription, deleteTask, addTaskToColumn, getTasks } from '../services/taskService';
import { loadColumns } from '../services/columnService';
import { setupColumnsDragAndDrop } from '../utils/dragAndDrop';

export function createTaskElement(task: Task): HTMLElement {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task', 'item');
    taskElement.setAttribute('draggable', 'true');

    if (task._id) {
        taskElement.id = task._id;
    }

    const taskHeader = document.createElement('div');
    taskHeader.classList.add('taskHeader');

    const taskTitle = document.createElement('div');
    taskTitle.classList.add('taskTitle');
    taskTitle.textContent = task.title;

    const taskDots = document.createElement('div');
    taskDots.classList.add('menuDots');
    taskDots.innerHTML = "\u22EE"; 
    taskDots.setAttribute('draggable', 'false');

    taskHeader.appendChild(taskTitle);
    taskHeader.appendChild(taskDots);

    const taskDescription = document.createElement('div');
    taskDescription.classList.add('taskDescription');
    taskDescription.textContent = task.description;

    taskElement.appendChild(taskHeader);
    taskElement.appendChild(taskDescription);

    setupTaskDragAndDrop(task);
    setupMenuDialog(taskDots, taskTitle, taskDescription, taskElement);

    return taskElement;
}

export function setupMenuDialog(taskDots: HTMLElement, taskTitle: HTMLElement, taskDescription: HTMLElement, taskElement: HTMLElement) {
    taskDots.onclick = () => {

        let taskDialog = taskDots.querySelector('.menuDialog') as HTMLElement;

        if (taskDialog) {
            taskDialog.style.display = taskDialog.style.display === 'block' ? 'none' : 'block';
        } else {
            taskDialog = document.createElement('div');
            taskDialog.classList.add('menuDialog');

            const titleHeader = document.createElement('h2');
            titleHeader.textContent = 'Column dialog';
            taskDialog.appendChild(titleHeader);

            const editTaskTitle = document.createElement('button');
            editTaskTitle.innerHTML = 'Edit title';
            taskDialog.appendChild(editTaskTitle);
            
            editTaskTitle.onclick = () => {
                taskTitle.innerHTML = '';
                const inputTitle = document.createElement('input');
                inputTitle.type = 'text';
                inputTitle.value = taskTitle.textContent || '';
                taskTitle.appendChild(inputTitle);
                inputTitle.focus();
            
                const saveTitle = async () => {
                    taskTitle.textContent = inputTitle.value;
                    taskDialog.style.display = 'none';
            
                    const columnElement = taskElement.parentElement;
                    if (columnElement) {
                        const columnId = columnElement.id;
                        const columnIndex = columns.findIndex(column => column._id === columnId);
                        if (columnIndex !== -1) {
                            const taskId = taskElement.id;
                            if (taskId) {
                                await patchTaskTitle(columnElement.id, taskId, inputTitle.value);

                                const taskIndex = columns[columnIndex].tasks.findIndex(
                                    task => task._id === taskId);

                                removeTaskDragAndDrop(columns[columnIndex].tasks[taskIndex]);

                                setupTaskDragAndDrop(columns[columnIndex].tasks[taskIndex]);
                            }
                        }
                    }
                };
            
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                taskDialog.appendChild(saveButton);
            
                saveButton.onclick = saveTitle;
            
                inputTitle.addEventListener('keypress', (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        saveTitle();
                    }
                });
            };

            const editTaskDescription =  document.createElement('button');
            editTaskDescription.innerHTML = 'Edit desc';
            taskDialog.appendChild(editTaskDescription);
            
            editTaskDescription.onclick = () => {
                taskDescription.innerHTML = '';
                const inputTitle = document.createElement('input');
                inputTitle.type = 'text';
                inputTitle.value = taskDescription.textContent || '';
                taskDescription.appendChild(inputTitle);
                inputTitle.focus();
            
                const saveDescription = () => {
                    taskDescription.textContent = inputTitle.value;
                    taskDialog.style.display = 'none';
            
                    const columnElement = taskElement.parentElement;
                    if (columnElement) {
                        const columnId = columnElement.id;
                        patchTaskDescription(columnElement.id, taskElement.id, inputTitle.value);
                        const columnIndex = columns.findIndex(column => column._id === columnId);
                        if (columnIndex !== -1) {
                            const taskId = taskElement.id;
                            if (taskId) {
                                const taskIndex = columns[columnIndex].tasks.findIndex(
                                    task => task._id === taskId);

                                removeTaskDragAndDrop(columns[columnIndex].tasks[taskIndex]);

                                setupTaskDragAndDrop(columns[columnIndex].tasks[taskIndex]);

                            }
                        }
                    }
                };
            
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                taskDialog.appendChild(saveButton);
            
                saveButton.onclick = saveDescription;
            
                inputTitle.addEventListener('keypress', (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        saveDescription();
                    }
                });
            };

            const deleteTaskButton = document.createElement('button');
            deleteTaskButton.innerHTML = 'Delete task';

            taskDialog.appendChild(deleteTaskButton);

            deleteTaskButton.onclick = async () => {
                const columnElement = taskElement.parentElement;
                if (columnElement) {
                    const columnId = columnElement.id;
                    const columnIndex = columns.findIndex(column => column._id === columnId);
                    if (columnIndex !== -1) {
                        const taskId = taskElement.id;
                        if (taskId) {
                            deleteTask(columnElement.id, taskId);

                            const taskToBeRemoved = document.getElementById(taskId);
                            if (taskToBeRemoved) {
                                taskToBeRemoved.remove();
                            }
                        }
                    }
                }
            }
        }
        taskDots.appendChild(taskDialog);
    }
}

export async function submitTask(columnSelected: string, title: string, description: string): Promise<HTMLElement | null> {
    const columnElement = document.getElementById(columnSelected);

    if (!columnElement) {
        console.error('columnElement is null:', columnElement);
        return null;
    }

    try {
        const response = await addTaskToColumn(columnSelected, title, description);

        if (!response.success) {
            console.error('Error: response.success === false');
            return null;
        }

        await loadColumns();

        const columnData = columns.find(column => column._id === columnSelected);
        if (!columnData) {
            console.error(`Column with ID ${columnSelected} not found`);
            return null;
        }

        const taskToCreate = columnData.tasks.find(task => task.title === title);
        if (!taskToCreate) {
            console.error("Task not found!");
            return null;
        }

        const taskElement = createTaskElement(taskToCreate);
        columnElement.appendChild(taskElement);

        setupColumnsDragAndDrop();
        setupTaskDragAndDrop(taskToCreate);

        const dialog = document.getElementById('dialog');
        if (dialog) {
            dialog.remove();
        } else {
            console.error('Dialog not found!');
        }

        return taskElement;

    } catch (error) {
        console.error("Error adding task:", error);
        return null;
    }
}
