"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const columnModel_1 = require("./models/columnModel");
const columnService_1 = require("./services/columnService");
const dragAndDrop_1 = require("./utils/dragAndDrop");
const columnRenderer_1 = require("./components/columnRenderer");
const taskRenderer_1 = require("./components/taskRenderer");
window.onload = async () => {
    await (0, columnService_1.loadColumns)();
    (0, dragAndDrop_1.setupColumnsDragAndDrop)();
    columnModel_1.columns.forEach(column => {
        (0, columnRenderer_1.renderColumn)(column);
        column.tasks.forEach(task => (0, dragAndDrop_1.setupTaskDragAndDrop)(task));
    });
};
function addColumn() {
    const dialog = document.createElement('div');
    dialog.id = 'dialog';
    dialog.className = 'dialog';
    const dialogContent = document.createElement('div');
    dialogContent.className = 'dialog-content';
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.textContent = 'x';
    closeButton.onclick = () => {
        dialog.remove();
    };
    const titleHeader = document.createElement('h2');
    titleHeader.textContent = 'Add New Column';
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'columnTitle');
    titleLabel.textContent = 'Title:';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Enter column title';
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => (0, columnRenderer_1.submitColumn)(titleInput);
    dialogContent.appendChild(closeButton);
    dialogContent.appendChild(titleHeader);
    dialogContent.appendChild(titleLabel);
    dialogContent.appendChild(titleInput);
    dialogContent.appendChild(submitButton);
    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);
    titleInput.value = '';
    dialog.style.display = 'block';
}
async function addTask() {
    const dialog = document.createElement('div');
    dialog.id = 'dialog';
    dialog.className = 'dialog';
    const dialogContent = document.createElement('div');
    dialogContent.className = 'dialog-content';
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.textContent = 'x';
    closeButton.onclick = () => {
        dialog.remove();
    };
    const titleHeader = document.createElement('h2');
    titleHeader.textContent = 'Add New Task';
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'taskTitle');
    titleLabel.textContent = 'Title:';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'taskTitle';
    titleInput.placeholder = 'Enter task title';
    const descriptionLabel = document.createElement('label');
    descriptionLabel.setAttribute('for', 'taskDescription');
    descriptionLabel.textContent = 'Description:';
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.id = 'taskDescription';
    descriptionInput.placeholder = 'Enter task description';
    const columnLabel = document.createElement('div');
    columnLabel.textContent = 'Select Column:';
    const columnSelect = document.createElement('select');
    columnSelect.id = 'columnSelect';
    columnModel_1.columns.forEach(column => {
        const option = document.createElement('option');
        if (column._id) {
            option.value = column._id;
            option.textContent = column.title;
            columnSelect.appendChild(option);
        }
    });
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => (0, taskRenderer_1.submitTask)(columnSelect.value, titleInput.value, descriptionInput.value);
    dialogContent.appendChild(closeButton);
    dialogContent.appendChild(titleHeader);
    dialogContent.appendChild(titleLabel);
    dialogContent.appendChild(titleInput);
    dialogContent.appendChild(descriptionLabel);
    dialogContent.appendChild(descriptionInput);
    dialogContent.appendChild(columnLabel);
    dialogContent.appendChild(columnSelect);
    dialogContent.appendChild(submitButton);
    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);
    dialog.style.display = 'block';
}
