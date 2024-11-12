"use strict";
let columnIdCounter = 0;
let taskIdCounter = 0;
let columns = [];
let placeholder = null;
let sourceColumnId = null;
const url = 'http://localhost:3000';
async function getColumns() {
    const getColumnUrl = url.concat('/columns/');
    try {
        const response = await fetch(getColumnUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const msg = await response.json();
        console.log(msg);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}
async function postColumn(columnData) {
    const postColumnUrl = url.concat('/columns/');
    try {
        const response = await fetch(postColumnUrl, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(columnData)
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.json();
        console.log('Column created: ', result);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error posting column: ', error.message);
        }
    }
}
async function patchTasks(columnId, newTask) {
    const patchTaskUrl = url.concat(`/columns/${columnId}/tasks`);
    try {
        const response = await fetch(patchTaskUrl, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        if (!response.ok) {
            throw new Error(`Failed to add task. Server responded with ${response.status}`);
        }
        const updateColumn = await response.json();
        console.log('Updated column: ', updateColumn);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error adding task: ', error);
        }
    }
}
window.onload = () => {
    loadFromLocalStorage();
    const taskIdCounterStored = localStorage.getItem('task-id');
    if (taskIdCounterStored) {
        const savedTaskIdCounter = JSON.parse(taskIdCounterStored);
        const savedTaskIdCounterToNumber = parseInt(savedTaskIdCounter.split('-')[1], 10);
        const taskIdToNumber = (savedTaskIdCounterToNumber);
        taskIdCounter = taskIdToNumber;
    }
    const colIdStored = localStorage.getItem('column-id');
    if (colIdStored) {
        const colIdToNumber = parseInt(colIdStored.split('-')[1], 10);
        columnIdCounter = colIdToNumber;
    }
    getColumns();
};
/** Abre o menu de dialogo para inserir o nome da coluna. */
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
    const colId = `column-${columnIdCounter}`;
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = colId;
    titleInput.placeholder = 'Enter column title';
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => submitColumn(colId);
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
/**
* Insere coluna no documento
* @param {string} colId: id da coluna no formato `column-${columnIdCounter}`
*/
function submitColumn(colId) {
    columnIdCounter++;
    console.log(colId);
    const titleInput = document.getElementById(colId);
    const title = titleInput ? titleInput.value.trim() : null;
    if (titleInput && title) {
        columns.push({ id: colId, title, tasks: [] });
        const columnData = { title, tasks: [] };
        postColumn(columnData);
        saveToLocalStorage();
        renderColumns({ id: colId, title, tasks: [] });
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
    const colIdToString = JSON.stringify(colId);
    localStorage.setItem('column-id', colIdToString);
}
/** Adiciona eventListeners para drag-and-drop às colunas. */
function setupColumnsDragAndDrop() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => handleDragOver(e));
        column.addEventListener('dragenter', (e) => handleDragEnter(e));
        column.addEventListener('dragleave', (e) => handleDragLeave(e));
        column.addEventListener('drop', (e) => handleDrop(e));
    });
}
/**
* handler para tratar de elementos que estão sendo arrastados e serão inseridos
* em uma posição na coluna
* @param {DragEvent} e: DragEvent
*/
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
/**
* Calcula nova posicao da task na coluna com base no eixo Y
* @param {HTMLElementa} column: elemento coluna no documento
* @param {number} posY: eixo Y
*/
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
/** handler para adicionar propriedade 'over' ao elemento HTML */
function handleDragEnter(e) {
    const target = e.currentTarget;
    target.classList.add('over');
}
/**  handler para remover propriedade 'over' ao elemento HTML */
function handleDragLeave(e) {
    const target = e.currentTarget;
    target.classList.remove('over');
}
/**
* handler para adicionar elemento sendo draggeado e remover propriedade 'over'
* @param {DragEvent} e: DragEvent
*/
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
/**
* Renderiza colunas no documento
* @param {column} column: coluna
*/
function renderColumns(column) {
    const itemContainer = document.getElementById('itemContainer');
    if (!itemContainer) {
        console.error('Item container not found');
        return;
    }
    const columnElement = document.createElement('div');
    columnElement.id = column.id;
    columnElement.classList.add('column');
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
                    const columnIndex = columns.findIndex(col => col.id === column.id);
                    if (columnIndex !== -1) {
                        columns.splice(columnIndex, 1, Object.assign(Object.assign({}, columns[columnIndex]), { title: inputTitle.value }));
                        saveToLocalStorage();
                    }
                };
                inputTitle.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        columnTitle.textContent = inputTitle.value;
                        columnDialog.style.display = 'none';
                        const columnIndex = columns.findIndex(col => col.id === column.id);
                        if (columnIndex !== -1) {
                            columns.splice(columnIndex, 1, Object.assign(Object.assign({}, columns[columnIndex]), { title: inputTitle.value }));
                            saveToLocalStorage();
                        }
                    }
                });
            };
            const deleteColumn = document.createElement('button');
            deleteColumn.innerHTML = 'Delete';
            deleteColumn.onclick = () => {
                const columnIndex = columns.findIndex(col => col.id === column.id);
                columnIdCounter--;
                const colId = `column-${columnIdCounter}`;
                const colIdToString = JSON.stringify(colId);
                localStorage.setItem('column-id', colIdToString);
                taskIdCounter -= columns[columnIndex].tasks.length;
                const taskId = `task-${taskIdCounter}`;
                const taskIdToString = JSON.stringify(taskId);
                localStorage.setItem('task-id', taskIdToString);
                if (columnIndex !== -1) {
                    columns.splice(columnIndex, 1);
                }
                const columnToBeRemoved = document.getElementById(column.id);
                if (columnToBeRemoved) {
                    columnToBeRemoved.remove();
                }
                saveToLocalStorage();
            };
            columnDialog.appendChild(editColumnTitle);
            columnDialog.appendChild(deleteColumn);
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
        const taskElement = createTaskElement(task.id, task.title, task.description);
        columnElement.appendChild(taskElement);
    });
    itemContainer.appendChild(columnElement);
    setupColumnsDragAndDrop();
}
/** Cria dialogo para adicionar nova task */
function addTask() {
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
    columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column.id;
        option.textContent = column.title;
        columnSelect.appendChild(option);
    });
    const taskId = `task-${taskIdCounter}`;
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => submitTask(columnSelect.value, taskId);
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
/*
* Adiciona elemento task à uma coluna
* @param {string} columnSelected: coluna selecionada em 'submitTask'
* @param {string} taskId: id da task
*/
function submitTask(columnSelected, taskId) {
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const title = titleInput.value.trim() || '';
    const description = descriptionInput.value.trim() || '';
    const columnElement = document.getElementById(columnSelected);
    if (!columnElement)
        return null;
    const taskElement = createTaskElement(taskId, title, description);
    columnElement.appendChild(taskElement);
    const columnData = columns.find(column => column.id === columnSelected);
    if (columnData) {
        columnData.tasks.push({ id: taskId, title, description });
        // patchTasks(columnSelected)
        saveToLocalStorage();
    }
    if (titleInput)
        titleInput.value = '';
    if (descriptionInput)
        descriptionInput.value = '';
    setupColumnsDragAndDrop();
    setupTaskDragAndDrop(taskId, title, description);
    const dialog = document.getElementById('dialog');
    if (dialog) {
        dialog.remove();
    }
    else {
        console.error('Dialog not found!');
    }
    taskIdCounter++;
    const taskIdToString = JSON.stringify(taskId);
    localStorage.setItem('task-id', taskIdToString);
    return taskElement;
}
function createTaskElement(taskId, title, description) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task', 'item');
    taskElement.setAttribute('draggable', 'true');
    taskElement.id = taskId;
    const taskHeader = document.createElement('div');
    taskHeader.classList.add('taskHeader');
    const taskTitle = document.createElement('div');
    taskTitle.classList.add('taskTitle');
    taskTitle.textContent = title;
    const taskDots = document.createElement('div');
    taskDots.classList.add('menuDots');
    taskDots.innerHTML = "\u22EE";
    taskDots.setAttribute('draggable', 'false');
    taskHeader.appendChild(taskTitle);
    taskHeader.appendChild(taskDots);
    const taskDescription = document.createElement('div');
    taskDescription.classList.add('taskDescription');
    taskDescription.textContent = description;
    taskElement.appendChild(taskHeader);
    taskElement.appendChild(taskDescription);
    setupTaskDragAndDrop(taskId, title, description);
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
                const saveTitle = () => {
                    taskTitle.textContent = inputTitle.value;
                    taskDialog.style.display = 'none';
                    const columnElement = taskElement.parentElement;
                    if (columnElement) {
                        const columnId = columnElement.id;
                        const columnIndex = columns.findIndex(column => column.id === columnId);
                        if (columnIndex !== -1) {
                            const taskId = taskElement.id;
                            if (taskId) {
                                const taskIndex = columns[columnIndex].tasks.findIndex(task => task.id === taskId);
                                columns[columnIndex].tasks[taskIndex].title = inputTitle.value;
                                removeTaskDragAndDrop(columns[columnIndex].tasks[taskIndex].id);
                                setupTaskDragAndDrop(columns[columnIndex].tasks[taskIndex].id, columns[columnIndex].tasks[taskIndex].title, columns[columnIndex].tasks[taskIndex].description);
                                saveToLocalStorage();
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
                        const columnIndex = columns.findIndex(column => column.id === columnId);
                        if (columnIndex !== -1) {
                            const taskId = taskElement.id;
                            if (taskId) {
                                const taskIndex = columns[columnIndex].tasks.findIndex(task => task.id === taskId);
                                columns[columnIndex].tasks[taskIndex].description = inputTitle.value;
                                removeTaskDragAndDrop(columns[columnIndex].tasks[taskIndex].id);
                                setupTaskDragAndDrop(columns[columnIndex].tasks[taskIndex].id, columns[columnIndex].tasks[taskIndex].title, columns[columnIndex].tasks[taskIndex].description);
                                saveToLocalStorage();
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
            const deleteTask = document.createElement('button');
            deleteTask.innerHTML = 'Delete task';
            taskDialog.appendChild(deleteTask);
            deleteTask.onclick = () => {
                const columnElement = taskElement.parentElement;
                if (columnElement) {
                    const columnId = columnElement.id;
                    const columnIndex = columns.findIndex(column => column.id === columnId);
                    taskIdCounter -= columns[columnIndex].tasks.length;
                    if (columnIndex !== -1) {
                        const taskId = taskElement.id;
                        if (taskId) {
                            const taskIndex = columns[columnIndex].tasks.findIndex(task => task.id === taskId);
                            const taskIdString = `task-${taskIdCounter}`;
                            const taskIdToString = JSON.stringify(taskIdString);
                            localStorage.setItem('task-id', taskIdToString);
                            columns[columnIndex].tasks.splice(taskIndex, 1);
                            const taskToBeRemoved = document.getElementById(taskId);
                            if (taskToBeRemoved) {
                                taskToBeRemoved.remove();
                            }
                            saveToLocalStorage();
                        }
                    }
                }
            };
        }
        taskDots.appendChild(taskDialog);
    };
}
/**
* Adiciona propriedade drag-and-drop às tasks
* @param {string} taskId: id da task
* @param {string} title: titulo da task
* @param {string} description: descricao da task
*/
function setupTaskDragAndDrop(taskId, title, description) {
    const task = document.getElementById(taskId);
    if (!task) {
        return;
    }
    const parentColumn = task.closest('.column');
    if (parentColumn) {
        task.setAttribute('data-column-id', parentColumn.id);
    }
    task.addEventListener('dragstart', (e => handleDragStart(e, taskId)));
    task.addEventListener('dragend', (e => handleDragEnd(e, taskId, title, description)));
}
function removeTaskDragAndDrop(taskId) {
    const task = document.getElementById(taskId);
    if (!task) {
        return;
    }
    const parentColumn = task.closest('.column');
    if (parentColumn) {
        task.setAttribute('data-column-id', parentColumn.id);
    }
    const clone = task.cloneNode(true);
    task.replaceWith(clone);
}
/**
* handler para quando a task iniciar o processo de drag
* @param {DragEvent} e: DragEvent
*/
function handleDragStart(e, taskId) {
    const target = e.currentTarget;
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', target.id);
    }
    sourceColumnId = target.getAttribute('data-column-id');
    const targetColumn = e.currentTarget;
    if (targetColumn) {
        const columnElement = targetColumn.closest('.column');
        if (columnElement) {
            const columnId = columnElement.id;
            const columnIndex = columns.findIndex(column => column.id === columnId);
            if (columnIndex !== -1) {
                const taskIndex = columns[columnIndex].tasks.findIndex(task => task.id === taskId);
                columns[columnIndex].tasks.splice(taskIndex, 1);
            }
        }
    }
    target.classList.add('dragging');
    placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.height = `${target.offsetHeight}px`;
}
/**
* handler para quando a task encerrar o processo de drag
* @param {DragEvent} e: DragEvent
* @param {string} taskId: id da task
* @param {string} title: titulo da task
* @param {string} description: descricao da task
*/
function handleDragEnd(e, taskId, title, description) {
    const dragging = document.querySelector('.dragging');
    console.log('(DragEnd) taskId: ', taskId);
    console.log('(DragEnd) title: ', title);
    if (dragging && placeholder) {
        const targetColumn = e.currentTarget;
        const columnElement = targetColumn.closest('.column');
        const columnIndex = columns.findIndex(column => column.id === columnElement.id);
        if (columnIndex !== -1) {
            if (columnElement !== null) {
                const allTasks = columnElement.querySelectorAll('.task');
                let newIndex = Array.from(allTasks).indexOf(dragging);
                if (newIndex !== -1) {
                    columns[columnIndex].tasks.splice(newIndex, 0, { id: taskId, title, description });
                    saveToLocalStorage();
                }
                else {
                    console.error('newIndex === -1 !!!');
                }
            }
            else {
                console.error('columnElement === null !!!');
            }
        }
        else {
            console.error('columnIndex === -1 !!!');
        }
        placeholder.replaceWith(dragging);
        dragging.id = taskId;
        dragging.classList.remove('dragging');
        placeholder = null;
    }
}
/** Salva tasks no localStorage */
function saveToLocalStorage() {
    const columnsData = JSON.stringify(columns);
    localStorage.setItem('columns', columnsData);
}
/** Carrega tasks do localStorage */
function loadFromLocalStorage() {
    const columnsData = localStorage.getItem('columns');
    if (columnsData) {
        const savedColumns = JSON.parse(columnsData);
        columns = savedColumns;
        setupColumnsDragAndDrop();
        columns.forEach(column => {
            renderColumns(column);
            column.tasks.forEach(task => {
                setupTaskDragAndDrop(task.id, task.title, task.description);
            });
        });
    }
}
