import { columns } from '../models/Column';
import { patchColumn, deleteColumn, postColumn, loadColumns } from '../services/ColumnService';
import { setupColumnsDragAndDrop } from '../utils/DragAndDrop';
import { createTaskElement } from '../components/TaskRenderer';
export function renderColumn(column) {
    const itemContainer = document.getElementById('itemContainer');
    if (!itemContainer) {
        console.error('Item container not found');
        return;
    }
    const columnElement = document.createElement('div');
    columnElement.classList.add('column');
    const columnId = column._id;
    if (columnId) {
        columnElement.id = columnId;
    }
    const columnTitle = document.createElement('div');
    columnTitle.classList.add('columnTitle');
    columnTitle.textContent = column.title;
    const menuDots = document.createElement('div');
    menuDots.classList.add('menuDots');
    menuDots.innerHTML = "\u22EE";
    menuDots.onclick = () => {
        let columnDialog = menuDots.querySelector('.menuDialog');
        if (columnDialog) {
            columnDialog.style.display = columnDialog.style.display === 'block' ? 'none' : 'block';
        }
        else {
            columnDialog = document.createElement('div');
            columnDialog.classList.add('menuDialog');
            const titleHeader = document.createElement('h2');
            titleHeader.textContent = 'Column dialog';
            columnDialog.appendChild(titleHeader);
            const editColumnTitle = document.createElement('button');
            editColumnTitle.innerHTML = 'Edit';
            editColumnTitle.onclick = () => {
                columnTitle.innerHTML = '';
                const inputTitle = document.createElement('input');
                inputTitle.type = 'text';
                inputTitle.value = columnTitle.textContent || '';
                columnTitle.appendChild(inputTitle);
                inputTitle.focus();
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                columnDialog.appendChild(saveButton);
                saveButton.onclick = () => {
                    columnTitle.textContent = inputTitle.value;
                    columnDialog.style.display = 'none';
                    const columnIndex = columns.findIndex(col => col._id === column._id);
                    if (column._id) {
                        patchColumn(column._id, inputTitle.value);
                    }
                    if (columnIndex !== -1) {
                        columns.splice(columnIndex, 1, {
                            ...columns[columnIndex],
                            title: inputTitle.value
                        });
                    }
                };
                inputTitle.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        columnTitle.textContent = inputTitle.value;
                        columnDialog.style.display = 'none';
                        const columnIndex = columns.findIndex(col => col._id === column._id);
                        if (columnIndex !== -1) {
                            columns.splice(columnIndex, 1, {
                                ...columns[columnIndex],
                                title: inputTitle.value
                            });
                        }
                    }
                });
            };
            const deleteColumnButton = document.createElement('button');
            deleteColumnButton.innerHTML = 'Delete';
            deleteColumnButton.onclick = async () => {
                const columnIndex = columns.findIndex(col => col._id === column._id);
                if (column._id) {
                    await deleteColumn(column._id);
                    const columnToBeRemoved = document.getElementById(column._id);
                    if (columnToBeRemoved) {
                        columnToBeRemoved.remove();
                    }
                }
            };
            columnDialog.appendChild(editColumnTitle);
            columnDialog.appendChild(deleteColumnButton);
            menuDots.appendChild(columnDialog);
            columnDialog.style.display = 'block';
            columnDialog.onclick = (e) => {
                e.stopPropagation();
            };
        }
    };
    const columnTitleContainer = document.createElement('div');
    columnTitleContainer.classList.add('columnTitleContainer');
    columnTitleContainer.appendChild(columnTitle);
    columnTitleContainer.appendChild(menuDots);
    columnElement.appendChild(columnTitleContainer);
    column.tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        columnElement.appendChild(taskElement);
    });
    itemContainer.appendChild(columnElement);
    setupColumnsDragAndDrop();
}
export async function submitColumn(titleInput) {
    const title = titleInput.value;
    if (titleInput && title) {
        const columnData = { title, tasks: [] };
        await postColumn(columnData);
        await loadColumns();
        const columnToRender = columns.find(column => column.title === title);
        if (columnToRender) {
            renderColumn(columnToRender);
        }
        else {
            console.log('Column does not exist: ', columnToRender);
            return null;
        }
    }
    else {
        console.error('Title cannot be empty');
    }
    if (titleInput)
        titleInput.value = '';
    const dialog = document.getElementById('dialog');
    if (dialog) {
        dialog.remove();
    }
    else {
        console.error('Dialog not found!');
    }
}
