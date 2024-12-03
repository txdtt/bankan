"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupColumnsDragAndDrop = setupColumnsDragAndDrop;
exports.handleDragOver = handleDragOver;
exports.getNewPosition = getNewPosition;
exports.handleDragEnter = handleDragEnter;
exports.handleDragLeave = handleDragLeave;
exports.handleDrop = handleDrop;
exports.setupTaskDragAndDrop = setupTaskDragAndDrop;
exports.removeTaskDragAndDrop = removeTaskDragAndDrop;
exports.handleDragStart = handleDragStart;
exports.handleDragEnd = handleDragEnd;
const columnModel_1 = require("../models/columnModel");
const taskService_1 = require("../services/taskService");
let sourceColumnId = null;
let placeholder = null;
function setupColumnsDragAndDrop() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => handleDragOver(e));
        column.addEventListener('dragenter', (e) => handleDragEnter(e));
        column.addEventListener('dragleave', (e) => handleDragLeave(e));
        column.addEventListener('drop', (e) => handleDrop(e));
    });
}
function handleDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
    }
    const column = e.currentTarget;
    const dragging = document.querySelector('.dragging');
    if (dragging) {
        const applyAfter = getNewPosition(column, e.clientY);
        if (applyAfter && applyAfter !== placeholder) {
            applyAfter.insertAdjacentElement('beforebegin', dragging);
        }
        else if (!applyAfter && column.lastElementChild !== placeholder) {
            column.appendChild(dragging);
        }
    }
}
function getNewPosition(column, posY) {
    const elements = Array.prototype.slice.call(column.querySelectorAll('.task:not(.dragging)'));
    for (const element of elements) {
        const box = element.getBoundingClientRect();
        const offset = posY - box.top - box.height / 2;
        if (offset < 0) {
            return element;
        }
    }
    return null;
}
function handleDragEnter(e) {
    const target = e.currentTarget;
    target.classList.add('over');
}
function handleDragLeave(e) {
    const target = e.currentTarget;
    target.classList.remove('over');
}
function handleDrop(e) {
    var _a;
    e.preventDefault();
    const data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
    let draggedElement;
    if (data) {
        draggedElement = document.getElementById(data);
    }
    const targetColumn = e.currentTarget;
    targetColumn.classList.remove('over');
}
function setupTaskDragAndDrop(task) {
    if (task._id) {
        const taskElement = document.getElementById(task._id);
        if (!taskElement) {
            return;
        }
        const parentColumn = taskElement.closest('.column');
        if (parentColumn) {
            taskElement.setAttribute('data-column-id', parentColumn.id);
        }
        taskElement.addEventListener('dragstart', (e => handleDragStart(e, task)));
        taskElement.addEventListener('dragend', (e => handleDragEnd(e, task)));
    }
}
function removeTaskDragAndDrop(task) {
    if (task._id) {
        const taskElement = document.getElementById(task._id);
        if (!taskElement) {
            return;
        }
        const parentColumn = taskElement.closest('.column');
        if (parentColumn) {
            taskElement.setAttribute('data-column-id', parentColumn.id);
        }
        const clone = taskElement.cloneNode(true);
        taskElement.replaceWith(clone);
    }
}
/**
* handler para quando a task iniciar o processo de drag
* @param {DragEvent} e: DragEvent
*/
async function handleDragStart(e, task) {
    const target = e.currentTarget;
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        if (task._id) {
            e.dataTransfer.setData('taskId', task._id);
        }
    }
    const targetColumn = e.currentTarget;
    const columnElement = targetColumn.closest('.column');
    if (task._id) {
        sourceColumnId = columnElement.id;
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
async function handleDragEnd(e, task) {
    const dragging = document.querySelector('.dragging');
    if (dragging && placeholder) {
        const targetColumn = e.currentTarget;
        const columnElement = targetColumn.closest('.column');
        if (columnElement && sourceColumnId) {
            const targetColumnId = columnElement.id;
            const columnIndex = columnModel_1.columns.findIndex(column => column._id === columnElement.id);
            if (task._id) {
                const allTasks = columnElement.querySelectorAll('.task');
                let newIndex = Array.from(allTasks).indexOf(dragging);
                if (newIndex !== -1) {
                    if (sourceColumnId === targetColumnId) {
                        if (task._id) {
                            const currentIndex = columnModel_1.columns[columnIndex].tasks.findIndex((t) => t._id === task._id);
                            columnModel_1.columns[columnIndex].tasks.splice(currentIndex, 1);
                            columnModel_1.columns[columnIndex].tasks.splice(newIndex, 0, { title: task.title, description: task.description, _id: task._id });
                            await (0, taskService_1.updateTaskOrder)(targetColumnId, columnModel_1.columns[columnIndex].tasks);
                        }
                    }
                    else {
                        columnModel_1.columns[columnIndex].tasks.splice(newIndex, 0, { title: task.title, description: task.description, _id: task._id });
                        await (0, taskService_1.moveTask)(sourceColumnId, targetColumnId, task._id);
                        await (0, taskService_1.updateTaskOrder)(targetColumnId, columnModel_1.columns[columnIndex].tasks);
                    }
                }
            }
        }
        placeholder.replaceWith(dragging);
        dragging.classList.remove('dragging');
        placeholder = null;
    }
}
