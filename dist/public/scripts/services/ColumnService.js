import { columns } from '../models/Column';
const url = 'http://localhost:3000';
export async function getColumns() {
    const getColumnUrl = url.concat('/columns');
    try {
        const response = await fetch(getColumnUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const msg = await response.json();
        return msg;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        return [];
    }
}
export async function postColumn(newColumn) {
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
        //const result = await response.json();
        //console.log('Column created: ', result);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error posting column: ', error.message);
        }
    }
}
export async function patchColumn(columnId, title) {
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
        //const updateColumn = await response.json();
        //console.log('Updated column: ', updateColumn);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        }
    }
}
export async function deleteColumn(columnId) {
    const deleteColumnUrl = url.concat(`/columns/${columnId}`);
    try {
        const response = await fetch(deleteColumnUrl, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
        });
        if (!response.ok) {
            console.error(`Error deleting column: ${response.status}`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}
export async function loadColumns() {
    const fetchedColumns = await getColumns();
    columns.length = 0;
    columns.push(...fetchedColumns);
}
