"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskElement = createTaskElement;
exports.setupMenuDialog = setupMenuDialog;
exports.submitTask = submitTask;
const Column_1 = require("../models/Column");
const DragAndDrop_1 = require("../utils/DragAndDrop");
const TaskService_1 = require("../services/TaskService");
const ColumnService_1 = require("../services/ColumnService");
const DragAndDrop_2 = require("../utils/DragAndDrop");
function createTaskElement(task) {
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
    (0, DragAndDrop_1.setupTaskDragAndDrop)(task);
    setupMenuDialog(taskDots, taskTitle, taskDescription, taskElement);
    return taskElement;
}
function setupMenuDialog(taskDots, taskTitle, taskDescription, taskElement) {
    taskDots.onclick = () => {
        let taskDialog = taskDots.querySelector('.menuDialog');
        if (taskDialog) {
            taskDialog.style.display = taskDialog.style.display === 'block' ? 'none' : 'block';
        }
        else {
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
                        const columnIndex = Column_1.columns.findIndex(column => column._id === columnId);
                        if (columnIndex !== -1) {
                            const taskId = taskElement.id;
                            if (taskId) {
                                await (0, TaskService_1.patchTaskTitle)(columnElement.id, taskId, inputTitle.value);
                                const taskIndex = Column_1.columns[columnIndex].tasks.findIndex(task => task._id === taskId);
                                (0, DragAndDrop_1.removeTaskDragAndDrop)(Column_1.columns[columnIndex].tasks[taskIndex]);
                                (0, DragAndDrop_1.setupTaskDragAndDrop)(Column_1.columns[columnIndex].tasks[taskIndex]);
                            }
                        }
                    }
                };
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                taskDialog.appendChild(saveButton);
                saveButton.onclick = saveTitle;
                inputTitle.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveTitle();
                    }
                });
            };
            const editTaskDescription = document.createElement('button');
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
                        (0, TaskService_1.patchTaskDescription)(columnElement.id, taskElement.id, inputTitle.value);
                        const columnIndex = Column_1.columns.findIndex(column => column._id === columnId);
                        if (columnIndex !== -1) {
                            const taskId = taskElement.id;
                            if (taskId) {
                                const taskIndex = Column_1.columns[columnIndex].tasks.findIndex(task => task._id === taskId);
                                (0, DragAndDrop_1.removeTaskDragAndDrop)(Column_1.columns[columnIndex].tasks[taskIndex]);
                                (0, DragAndDrop_1.setupTaskDragAndDrop)(Column_1.columns[columnIndex].tasks[taskIndex]);
                            }
                        }
                    }
                };
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                taskDialog.appendChild(saveButton);
                saveButton.onclick = saveDescription;
                inputTitle.addEventListener('keypress', (e) => {
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
                    const columnIndex = Column_1.columns.findIndex(column => column._id === columnId);
                    if (columnIndex !== -1) {
                        const taskId = taskElement.id;
                        if (taskId) {
                            (0, TaskService_1.deleteTask)(columnElement.id, taskId);
                            const taskToBeRemoved = document.getElementById(taskId);
                            if (taskToBeRemoved) {
                                taskToBeRemoved.remove();
                            }
                        }
                    }
                }
            };
        }
        taskDots.appendChild(taskDialog);
    };
}
async function submitTask(columnSelected, title, description) {
    const columnElement = document.getElementById(columnSelected);
    if (!columnElement) {
        console.error('columnElement is null:', columnElement);
        return null;
    }
    try {
        await (0, TaskService_1.addTaskInColumn)(columnSelected, title, description);
        await (0, ColumnService_1.loadColumns)();
        const columnData = Column_1.columns.find(column => column._id === columnSelected);
        if (!columnData) {
            console.error(`Column with ID ${columnSelected} not found`);
            return null;
        }
        const taskToCreate = columnData.tasks.find((task) => task.title === title);
        if (!taskToCreate) {
            console.error("Task not found!");
            return null;
        }
        const taskElement = createTaskElement(taskToCreate);
        columnElement.appendChild(taskElement);
        (0, DragAndDrop_2.setupColumnsDragAndDrop)();
        (0, DragAndDrop_1.setupTaskDragAndDrop)(taskToCreate);
        const dialog = document.getElementById('dialog');
        if (dialog) {
            dialog.remove();
        }
        else {
            console.error('Dialog not found!');
        }
        return taskElement;
    }
    catch (error) {
        console.error("Error adding task:", error);
        return null;
    }
}
