"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = getTasks;
exports.addTaskInColumn = addTaskInColumn;
exports.patchTaskTitle = patchTaskTitle;
exports.patchTaskDescription = patchTaskDescription;
exports.deleteTask = deleteTask;
exports.updateTaskOrder = updateTaskOrder;
exports.moveTask = moveTask;
const url = 'http://localhost:3000';
async function getTasks(columnId) {
    const getTaskUrl = url.concat(`/columns/${columnId}/tasks`);
    try {
        const response = await fetch(getTaskUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const msg = await response.json();
        //console.log(msg);
        return msg;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        return [];
    }
}
async function addTaskInColumn(columnId, title, description) {
    const patchTaskUrl = url.concat(`/columns/${columnId}/tasks`);
    const newTask = { title, description };
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
        //const updateTask = await response.json();
        //console.log('Updated task: ', updateTask);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error adding task: ', error);
        }
    }
}
async function patchTaskTitle(columnId, taskId, title) {
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
        //const updateTaskTitle = await response.json();
        //console.log('Updated task title: ', updateTaskTitle);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        }
    }
}
async function patchTaskDescription(columnId, taskId, description) {
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
        //const updateTaskTitle = await response.json();
        //console.log('Updated task description: ', updateTaskTitle);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        }
    }
}
async function deleteTask(columnId, taskId) {
    const deleteTaskUrl = url.concat(`/columns/${columnId}/tasks/${taskId}`);
    //console.log('(deleteTask) columnId: ', columnId, 'taskId: ', taskId);
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
        //console.log('Task deleted succesfully!');
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}
async function updateTaskOrder(columnId, tasks) {
    const updateTaskOrderUrl = url.concat(`/columns/${columnId}/reorder`);
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
        //console.log('Task order updated successfully'); 
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('updateTaskOrder: ', error);
        }
    }
}
async function moveTask(sourceColumnId, targetColumnId, taskId) {
    const moveTaskUrl = url.concat('/columns/moveTask');
    try {
        const response = await fetch(moveTaskUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceColumnId, targetColumnId, taskId })
        });
        if (!response.ok) {
            throw new Error(`Error moving task: ${response.statusText}`);
        }
        //console.log('Task order updated successfully'); 
    }
    catch (error) {
        console.error('Error moving task:', error);
    }
}
