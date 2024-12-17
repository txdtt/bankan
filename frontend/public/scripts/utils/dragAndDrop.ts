import { Task } from '../models/taskModel';
import { columns } from '../models/columnModel';
import { updateTaskOrder, moveTask, deleteTask, addTaskToColumn } from '../services/taskService';


window.onload = async () => {
}

let sourceColumnId: string | null = null;

let placeholder: HTMLElement | null = null;

export function setupColumnsDragAndDrop() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => 
                                    handleDragOver(e as DragEvent));

        column.addEventListener('dragenter', (e) => 
                                    handleDragEnter(e as DragEvent));

        column.addEventListener('dragleave', (e) => 
                                    handleDragLeave(e as DragEvent));

        column.addEventListener('drop', (e) => 
                                    handleDrop(e as DragEvent));
    });
}

export function handleDragOver(e: DragEvent) {
    e.preventDefault(); 

    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
    }

    const column = e.currentTarget as HTMLElement;
    const dragging = document.querySelector('.dragging') as HTMLElement | null;
    
    if (dragging) {
        const applyAfter = getNewPosition(column, e.clientY); 
        if (applyAfter && applyAfter !== placeholder) {
            applyAfter.insertAdjacentElement('beforebegin', dragging);
        } else if (!applyAfter && column.lastElementChild !== placeholder){
            column.appendChild(dragging); 
        }
    }
}

export function getNewPosition(column: HTMLElement, posY: number): HTMLElement | null {
    const elements = Array.prototype.slice.call(column
                                                .querySelectorAll
                                                ('.task:not(.dragging)')) as HTMLElement[];

    for (const element of elements) {
        const box = element.getBoundingClientRect();
        const offset = posY - box.top - box.height / 2;
        if (offset < 0) {
            return element as HTMLElement;
        }
    }

    return null;
}

export function handleDragEnter(e: DragEvent) {
    const target = e.currentTarget as HTMLElement;
    target.classList.add('over');
}

export function handleDragLeave(e: DragEvent) {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('over');
}

export function handleDrop(e: DragEvent) {
    e.preventDefault();

    const data = e.dataTransfer?.getData('text/plain');
    let draggedElement;

    if (data) {
        draggedElement = document.getElementById(data); 
    }

    const targetColumn = e.currentTarget as HTMLElement;

    targetColumn.classList.remove('over');
}

export function setupTaskDragAndDrop(task: Task) {
    if (task._id) {
        const taskElement = document.getElementById(task._id);

        if (!taskElement) {
            return
        }

        const parentColumn = taskElement.closest('.column') as HTMLElement;

        if (parentColumn) {
            taskElement.setAttribute('data-column-id', parentColumn.id);
        }

        taskElement.addEventListener('dragstart', (e => 
                                                handleDragStart(e as DragEvent, task)) as EventListener);
        taskElement.addEventListener('dragend', (e => 
                                        handleDragEnd(
                                            e as DragEvent, task)) as EventListener);
    }
}

export function removeTaskDragAndDrop(task: Task) {
    if (task._id) {
        const taskElement = document.getElementById(task._id);

        if (!taskElement) {
            return
        }

        const parentColumn = taskElement.closest('.column') as HTMLElement;

        if (parentColumn) {
            taskElement.setAttribute('data-column-id', parentColumn.id);
        }

        const clone = taskElement.cloneNode(true) as HTMLElement;
        taskElement.replaceWith(clone);
    }
}

/** 
* handler para quando a task iniciar o processo de drag
* @param {DragEvent} e: DragEvent
*/
export async function handleDragStart(e: DragEvent, task: Task) {
    const target = e.currentTarget as HTMLElement;
    console.log('(handleDragStart)');

    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        if (task._id) {
            e.dataTransfer.setData('taskId', task._id); 
        }
    }
    
    const targetColumn = e.currentTarget as HTMLElement;
    const columnElement = targetColumn.closest('.column') as HTMLElement;

    if (task._id) {
        sourceColumnId = columnElement.id; 
        //console.log('sourceColumnId: ', sourceColumnId);
        deleteTask(sourceColumnId, task._id);
    }

    target.classList.add('dragging');

    placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.height = `${target.offsetHeight}px`;
}

/** 
* handler para quando a task encerrar o processo de drag
* @param {DragEvent} e: DragEvent
*/
export async function handleDragEnd(e: DragEvent, task: Task) {
    const dragging = document.querySelector('.dragging') as HTMLElement | null;

    if (dragging && placeholder) {
        const targetColumn = e.currentTarget as HTMLElement;
        const columnElement = targetColumn.closest('.column') as HTMLElement;

        if (columnElement && sourceColumnId) {
            const targetColumnId = columnElement.id;
            const columnIndex = columns.findIndex(column => column._id === columnElement.id);

            if (task._id) {
                const allTasks = columnElement.querySelectorAll('.task');
                let newIndex = Array.from(allTasks).indexOf(dragging);

                if (newIndex !== -1) {
                    const targetTasks = columns[columnIndex].tasks;
                    if (sourceColumnId === targetColumnId) {
                        const currentIndex = targetTasks.findIndex((t) => t._id === task._id);
                        if (currentIndex !== -1) {
                            targetTasks.splice(currentIndex, 1);
                        }
                    } else {
                        const sourceColumn = columns.find((col) => col._id === sourceColumnId);
                        if (sourceColumn) {
                            sourceColumn.tasks = sourceColumn.tasks.filter((t) => t._id !== task._id);
                        }
                    }

                    if (!targetTasks.find((t) => t._id === task._id)) {
                        targetTasks.splice(newIndex, 0, {
                            _id: task._id,
                            title: task.title,
                            description: task.description
                        })
                    }

                    await updateTaskOrder(targetColumnId, targetTasks);
                }
            }
        }

        placeholder.replaceWith(dragging);
        dragging.classList.remove('dragging');
        placeholder = null;
    }
}
