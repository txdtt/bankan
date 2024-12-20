import { Column, columns } from '../models/columnModel';

const url = 'http://localhost:3000';

export async function getColumns(): Promise<any[]> {
    const getColumnUrl = url.concat('/api/columns');
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

export async function postColumn(newColumn: Column) {
    const postColumnUrl = url.concat('/api/columns');
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error posting column: ', error.message);
        }
    }
}

export async function patchColumn(columnId: string, title: string) {
    const patchColumnUrl = url.concat(`/api/columns/${columnId}`);
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        }
    }
}

export async function deleteColumn(columnId: string) {
    const deleteColumnUrl = url.concat(`/api/columns/${columnId}`);
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

export async function loadColumns() {
    const fetchedColumns = await getColumns();
    columns.length = 0;
    columns.push(...fetchedColumns);
}
