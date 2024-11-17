type Task = {
    _id?: string;
    title: string;
    description: string;
}

type Column = {
    _id?: string;
    title: string;
    tasks: Task[];
}

let columns: Column[] = [];

let sourceColumnId: string | null = null;

let placeholder: HTMLElement | null = null;

const url = 'http://localhost:3000';

async function getColumns(): Promise<any[]> {
    const getColumnUrl = url.concat('/columns');

    try {
        const response = await fetch(getColumnUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const msg = await response.json();
        return msg;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } 
        return [];
    }
}

async function loadColumns() {
    columns = await getColumns();
}

async function postColumn(newColumn: Column) {
    const postColumnUrl = url.concat('/columns');

    try {
        const response = await fetch(postColumnUrl, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newColumn)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        //console.log('Column created: ', result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error posting column: ', error.message);
        }
    }
}

async function patchColumn(columnId: string, title: string) {
    const patchColumnUrl = url.concat(`/columns/${columnId}`);
    try {
        const response = await fetch(patchColumnUrl, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error(`Failed to add column. Server responded with ${response.status}`);
        }

        const updateColumn = await response.json();
        //console.log('Updated column: ', updateColumn);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        }
    }
}

async function deleteColumn(columnId: string) {
    const deleteColumnUrl = url.concat(`/columns/${columnId}`);

    try {
        const response = await fetch(deleteColumnUrl, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
        })

        if (!response.ok) {
            console.error(`Error deleting column: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}

async function getTasks(columnId: string) {
    const getTaskUrl = url.concat(`/columns/${columnId}/tasks`);

    try {
        const response = await fetch(getTaskUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const msg = await response.json();
        //console.log(msg);
        return msg;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } 
        return [];
    }
}

async function addTaskInColumn(columnId: string, title: string, description: string) {
    const patchTaskUrl = url.concat(`/columns/${columnId}/tasks`);
    const newTask =  { title, description };

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

        const updateTask = await response.json();
        console.log('Updated task: ', updateTask);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error adding task: ', error);
        }
    }
}

async function patchTaskTitle(columnId: string, taskId: string, title: string) {
    const patchTaskTitleUrl = url.concat(`/columns/${columnId}/tasks/${taskId}`);
        try {
            const response = await fetch(patchTaskTitleUrl, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ title })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update task title. Server responded with ${response.status}`);
            }
    
            const updateTaskTitle = await response.json();
            //console.log('Updated task title: ', updateTaskTitle);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
        }
    }
}

async function patchTaskDescription(columnId: string, taskId: string, description: string) {
    const patchTaskDescriptionUrl = url.concat(`/columns/${columnId}/tasks/${taskId}`);
        try {
            const response = await fetch(patchTaskDescriptionUrl, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ description })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update task description. Server responded with ${response.status}`);
            }
    
            const updateTaskTitle = await response.json();
            //console.log('Updated task description: ', updateTaskTitle);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
        }
    }
}

async function deleteTask(columnId: string, taskId: string) {
    const deleteTaskUrl = url.concat(`/columns/${columnId}/tasks/${taskId}`)
    console.log('(deleteTask) columnId: ', columnId, 'taskId: ', taskId);

    try {
        const response = await fetch(deleteTaskUrl, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error deleting the task: ${response.status}`);
        }

        console.log('Task deleted succesfully!');
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}

async function updateTaskOrder(columnId: string, tasks: Task[]) {
    const updateTaskOrderUrl = url.concat(`/columns/${columnId}/tasks/reorder`);

    try {
        const response = await fetch(updateTaskOrderUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tasks })
        }); 

        if (!response.ok) {
            throw new Error(`Error updating task order: ${response.statusText}`);
        }
    
        console.log('Task order updated successfully'); 
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('updateTaskOrder: ', error);
        }
    }
}

async function moveTask(sourceColumnId: string, targetColumnId: string, taskId: string) {
    const moveTaskUrl = url.concat('/columns/moveTask');

    try {
        const response = await fetch(moveTaskUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceColumnId, targetColumnId, taskId })
            }
        );

        if (!response.ok) {
            throw new Error(`Error moving task: ${response.statusText}`);
        }
    
        console.log('Task order updated successfully'); 
    } catch (error) {
        console.error('Error moving task:', error);
    }
}

window.onload = async () => {
    await loadColumns();
    setupColumnsDragAndDrop();
    columns.forEach(column => {
        renderColumn(column);
        column.tasks.forEach(task => setupTaskDragAndDrop(task));
    })
}

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

/** 
* Insere coluna no documento
* @param {string} colId: id da coluna no formato `column-${columnIdCounter}`
*/
async function submitColumn(titleInput: HTMLInputElement) {
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

/** Adiciona eventListeners para drag-and-drop às colunas. */
function setupColumnsDragAndDrop() {
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

/** 
* handler para tratar de elementos que estão sendo arrastados e serão inseridos
* em uma posição na coluna
* @param {DragEvent} e: DragEvent
*/
function handleDragOver(e: DragEvent) {
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

/**
* Calcula nova posicao da task na coluna com base no eixo Y  
* @param {HTMLElementa} column: elemento coluna no documento
* @param {number} posY: eixo Y
*/
function getNewPosition(column: HTMLElement, posY: number): HTMLElement | null {
    const elements = Array.prototype.slice.call(column.querySelectorAll
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

/** handler para adicionar propriedade 'over' ao elemento HTML */
function handleDragEnter(e: DragEvent) {
    const target = e.currentTarget as HTMLElement;
    target.classList.add('over');
}

/**  handler para remover propriedade 'over' ao elemento HTML */
function handleDragLeave(e: DragEvent) {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('over');
}

/**
* handler para adicionar elemento sendo draggeado e remover propriedade 'over'
* @param {DragEvent} e: DragEvent
*/
function handleDrop(e: DragEvent) {
    e.preventDefault();

    const data = e.dataTransfer?.getData('text/plain');
    let draggedElement;

    if (data) {
        draggedElement = document.getElementById(data); 
    }

    const targetColumn = e.currentTarget as HTMLElement;

    targetColumn.classList.remove('over');
}

/**
* Renderiza colunas no documento
* @param {column} column: coluna
*/
function renderColumn(column: Column) {
    const itemContainer = document.getElementById('itemContainer');

    if (!itemContainer) {
        console.error('Item container not found');
        return;
    }

    const columnElement = document.createElement('div');
    columnElement.classList.add('column');

    const columnId = column._id;
    //console.log('(renderColumn) columnId: ', columnId);

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

                    const columnIndex = columns.findIndex(col => col._id === column._id);

                    if (column._id) {
                        patchColumn(column._id, inputTitle.value);
                    }


                    if (columnIndex !== -1) {
                        columns.splice(columnIndex, 1, {
                            ...columns[columnIndex],
                            title: inputTitle.value
                        })

                    }
                }

                inputTitle.addEventListener('keypress', (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        columnTitle.textContent = inputTitle.value;
                        columnDialog.style.display = 'none';

                        const columnIndex = columns.findIndex(col => col._id === column._id);
                        if (columnIndex !== -1) {
                            columns.splice(columnIndex, 1, {
                                ...columns[columnIndex],
                                title: inputTitle.value
                            })

                        }
                    }
                })
            }

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

    column.tasks.forEach(task => {
        const taskElement = createTaskElement(task);

        columnElement.appendChild(taskElement);
    })

    itemContainer.appendChild(columnElement);

    setupColumnsDragAndDrop();
}

/** Cria dialogo para adicionar nova task */
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

/*
* Adiciona elemento task à uma coluna
* @param {string} columnSelected: coluna selecionada em 'submitTask'
* @param {string} taskId: id da task
*/
async function submitTask(columnSelected: string, title: string, description: string): Promise<HTMLElement | null> {
    //console.log('columnSelect.value:', columnSelected);
    //console.log('title:', title);
    //console.log('description:', description);

    const columnElement = document.getElementById(columnSelected);
    if (!columnElement) {
        console.error('columnElement is null:', columnElement);
        return null;
    }

    try {
        await addTaskInColumn(columnSelected, title, description);
        //console.log('Task patched successfully.');

        await loadColumns();
        //console.log('Columns loaded successfully.');

        const columnData = columns.find(column => column._id === columnSelected);
        if (!columnData) {
            console.error(`Column with ID ${columnSelected} not found`);
            return null;
        }

        const taskToCreate = columnData.tasks.find((task: { title: string }) => task.title === title);
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

function createTaskElement(task: Task): HTMLElement {
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

function setupMenuDialog(taskDots: HTMLElement, taskTitle: HTMLElement, taskDescription: HTMLElement, taskElement: HTMLElement) {
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

/** 
* Adiciona propriedade drag-and-drop às tasks
* @param {string} taskId: id da task
* @param {string} title: titulo da task 
* @param {string} description: descricao da task
*/
function setupTaskDragAndDrop(task: Task) {
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

function removeTaskDragAndDrop(task: Task) {
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
async function handleDragStart(e: DragEvent, task: Task) {
    const target = e.currentTarget as HTMLElement;

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
async function handleDragEnd(e: DragEvent, task: Task) {
const dragging = document.querySelector('.dragging') as HTMLElement | null;

    if (dragging && placeholder) {
        const targetColumn = e.currentTarget as HTMLElement;
        const columnElement = targetColumn.closest('.column') as HTMLElement;

        if (columnElement && sourceColumnId) {
            const targetColumnId = columnElement.id;
            const columnIndex = columns.findIndex(column => column._id === columnElement.id);

            if (task._id) {
                console.log('task._id: ', task._id);
                console.log('sourceColumnId: ', sourceColumnId);
                console.log('targetColumnId: ', targetColumnId);
                await moveTask(sourceColumnId, targetColumnId, task._id);
            }
        }

        placeholder.replaceWith(dragging);
        dragging.classList.remove('dragging');
        placeholder = null;
    }
}
