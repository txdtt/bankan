import { Task } from '../models/taskModel';

const url = 'http://localhost:3000';

export async function getTasks(columnId: string) {
    const getTaskUrl = url.concat(`/api/columns/${columnId}/tasks`);

    try {
        const response = await fetch(getTaskUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const msg = await response.json();

        if (msg.success && Array.isArray(msg.tasks)) {
            return msg; 
        }

        return [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } 
        return [];
    }
}

export const addTaskToColumn = async (
    columnId: string,
    title: string,
    description: string
): Promise<{ success: boolean, message: string }> => {
    try {
        console.log('columnId: ', columnId);
        console.log('title: ', title);
        console.log('description: ', description);

        const response = await fetch(`/api/columns/${columnId}/tasks`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
            throw new Error(`!response.ok: Failed to add task: ${response.statusText}`);
        }

        return { success: true, message: 'Task added' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to add task!' };
    }
};

export async function patchTaskTitle(columnId: string, taskId: string, title: string) {
    const patchTaskTitleUrl = url.concat(`/api/columns/${columnId}/tasks/${taskId}`);
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
        }
    }
}

export async function patchTaskDescription(columnId: string, taskId: string, description: string) {
    const patchTaskDescriptionUrl = url.concat(`/api/columns/${columnId}/tasks/${taskId}`);
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
        }
    }
}

export async function deleteTask(columnId: string, taskId: string) {
    const deleteTaskUrl = url.concat(`/api/columns/${columnId}/tasks/${taskId}`)

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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}

export async function updateTaskOrder(columnId: string, tasks: Task[]) {
    const updateTaskOrderUrl = url.concat(`/api/columns/${columnId}/reorder`);

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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('updateTaskOrder: ', error);
        }
    }
}

export async function moveTask(sourceColumnId: string, targetColumnId: string, taskId: string) {
    const moveTaskUrl = url.concat('/api/columns/moveTask');

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
    
        //console.log('Task order updated successfully'); 
    } catch (error) {
        console.error('Error moving task:', error);
    }
}
