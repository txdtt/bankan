import { columns } from './models/columnModel'
import { loadColumns } from './services/columnService';
import { setupColumnsDragAndDrop, setupTaskDragAndDrop } from './utils/dragAndDrop';
import { renderColumn, submitColumn } from './components/columnRenderer';
import { submitTask } from './components/taskRenderer';

window.onload = async () => {
    await loadColumns();
    setupColumnsDragAndDrop();
    columns.forEach(column => {
        renderColumn(column);
        column.tasks.forEach(task => setupTaskDragAndDrop(task));
    })
}

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
    }

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

    submitButton.onclick = () => submitColumn(titleInput);

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
    }

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

    columns.forEach(column => {
        const option = document.createElement('option');
        if (column._id) {
            option.value = column._id;
            option.textContent = column.title;
            columnSelect.appendChild(option);
        }
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => submitTask(
        columnSelect.value, titleInput.value, descriptionInput.value) as Promise<HTMLElement>;

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
