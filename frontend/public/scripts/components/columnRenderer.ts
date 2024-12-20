import { Column, columns } from '../models/columnModel';
import { patchColumn, deleteColumn, postColumn, loadColumns } from '../services/columnService';
import { setupColumnsDragAndDrop } from '../utils/dragAndDrop';
import { createTaskElement } from '../components/taskRenderer';

export function renderColumn(column: Column) {
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
        let columnDialog = menuDots.querySelector('.menuDialog') as HTMLElement;

        if (columnDialog) {
            columnDialog.style.display = columnDialog.style.display === 'block' ? 'none' : 'block';
        } else {
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

                    if (column._id) {
                        patchColumn(column._id, inputTitle.value);
                    }
                }

                inputTitle.addEventListener('keypress', (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        columnTitle.textContent = inputTitle.value;
                        columnDialog.style.display = 'none';
                    }
                })
            }

            const deleteColumnButton = document.createElement('button');
            deleteColumnButton.innerHTML = 'Delete';

            deleteColumnButton.onclick = async () => {
                if (column._id) {
                    await deleteColumn(column._id);
                    const columnToBeRemoved = document.getElementById(column._id);
                    if (columnToBeRemoved) {
                        columnToBeRemoved.remove();
                    }
                }
            }

            columnDialog.appendChild(editColumnTitle);
            columnDialog.appendChild(deleteColumnButton);

            menuDots.appendChild(columnDialog);
            columnDialog.style.display = 'block';

            columnDialog.onclick = (e: Event) => {
                e.stopPropagation(); 
            };
        }
    }

    const columnTitleContainer = document.createElement('div');
    columnTitleContainer.classList.add('columnTitleContainer');

    columnTitleContainer.appendChild(columnTitle);
    columnTitleContainer.appendChild(menuDots);

    columnElement.appendChild(columnTitleContainer);

    if (column.tasks) {
        column.tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            columnElement.appendChild(taskElement);
        })
    }

    itemContainer.appendChild(columnElement);

    setupColumnsDragAndDrop();
}

export async function submitColumn(titleInput: HTMLInputElement) {
    const title = titleInput.value; 

    if (titleInput && title) {
        const columnData = {title, tasks: []};

        await postColumn(columnData);

        await loadColumns();

        const columnToRender = columns.find(column => column.title === title);

        if (columnToRender) {
            renderColumn(columnToRender);
        } else {
            console.log('Column does not exist: ', columnToRender);
            return null;
        }

    } else {
        console.error('Title cannot be empty');
    }

    if (titleInput) titleInput.value = '';

    const dialog = document.getElementById('dialog');
    if (dialog) {
        dialog.remove();
    } else {
        console.error('Dialog not found!');
    }
}
