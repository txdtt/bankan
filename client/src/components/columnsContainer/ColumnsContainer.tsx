import { useEffect, useState } from 'react';
import Column from '../column/Column';
import styles from './ColumnsContainer.module.css'
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import ColumnModel from '../../models/columnModel';

import { v4 as uuidv4 } from 'uuid';
import TaskModel from '../../models/taskModel';
import { Socket } from 'socket.io-client';

type ColumnsContainerProps = {
    socket: Socket;
}

const ColumnsContainer = ({ socket }: ColumnsContainerProps) => {
    const [columns, setColumns] = useState<ColumnModel[]>([]);
    const [isAddingColumn, setIsAddingColumn] = useState(false);

    const emitColumnsState = (newColumns: ColumnModel[]) => {
        socket.emit('updateColumns', newColumns);
    }

    useEffect(() => {
        socket.on('columnsUpdated', (updatedColumns) => {
            setColumns(updatedColumns);
        });

        return () => {
            socket.off('columnsUpdated');
        }
    })

    const addColumn = (columnTitle: string) => {
        if (columnTitle.trim() === "") {
            return;
        }
        const newColumn: ColumnModel = {
            _id: uuidv4(),
            title: columnTitle,
            tasks: [],
        };

        const newColumns = [...columns, newColumn];
        setColumns(newColumns);
        emitColumnsState(newColumns)
        setIsAddingColumn(false);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) 
            return;

        const [fromColumnId, taskId] = (active.id as string).split(":");
        const [toColumnId, targetTaskId]= (over.id as string).split(":");

        let updatedColumns = [...columns];

        if (fromColumnId !== toColumnId) {
            const fromColumnIndex = updatedColumns.findIndex((col) => col._id === fromColumnId);
            const toColumnIndex = updatedColumns.findIndex((col) => col._id === toColumnId);

            const fromTasks = [...updatedColumns[fromColumnIndex].tasks];
            const fromTaskIndex = fromTasks.findIndex((task) => task._id === taskId);

            const toTasks = [...updatedColumns[toColumnIndex].tasks];
            const toTaskIndex = toTasks.findIndex((task) => task._id === targetTaskId);
            
            const [movedTask] = fromTasks.splice(fromTaskIndex, 1);
            toTasks.splice(toTaskIndex, 0, movedTask);

            updatedColumns[fromColumnIndex].tasks = fromTasks;
            updatedColumns[toColumnIndex].tasks = toTasks;
        } else {
            const columnIndex = updatedColumns.findIndex((col) => col._id === fromColumnId);
            const tasks = [...updatedColumns[columnIndex].tasks];

            const fromTaskIndex = tasks.findIndex((task) => task._id === taskId);
            const toTaskIndex = tasks.findIndex((task) => task._id === targetTaskId);

            const [movedTask] = tasks.splice(fromTaskIndex, 1);
            tasks.splice(toTaskIndex, 0, movedTask);

            updatedColumns[columnIndex].tasks = tasks;
        }

        setColumns(updatedColumns);
        emitColumnsState(updatedColumns); 
    };

    const moveTaskNewColumn = (columnId: string, newTask: TaskModel) => {
        const updatedColumns = columns.map((col) => 
            col._id === columnId 
                ? {...col, tasks: [...col.tasks, newTask]}
                : col
        )

        setColumns(updatedColumns);
        emitColumnsState(updatedColumns);
    };

    const editTask = (columnId: string, taskId: string, updatedTask: TaskModel) => {
        const updatedColumns = columns.map((col) =>
            col._id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((task) =>
                    task._id === taskId ? updatedTask : task
                ),
            }
            : col
        )

        setColumns(updatedColumns);
        emitColumnsState(updatedColumns);
    };

    const deleteColumn = (columnId: string) => {
        const updatedColumns = columns.filter((col) => col._id !== columnId)
        
        setColumns(updatedColumns);
        emitColumnsState(updatedColumns);
    };

    const deleteTask = (columnId: string, taskId: string) => {
        const updatedColumns = columns.map((col) => 
            col._id === columnId
            ? {
                ...col,
                tasks: col.tasks.filter((task) => task._id !== taskId),
            }  
            : col       
        )

        setColumns(updatedColumns);
        emitColumnsState(updatedColumns);
    }

    return (
        <div>
            {isAddingColumn ? (
                <div>
                    <input 
                        type="text"
                        onBlur={(e) => addColumn(e.target.value)}
                        autoFocus
                    />
                </div>
            ) : (
                <button onClick={() => setIsAddingColumn(true)}>Add Column</button>
            )}
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className={styles.columnsContainer}>
                    {columns.map((column) => (
                        <Column key={column._id} column={column} moveTaskNewColumn={moveTaskNewColumn}
                        editTask={editTask} deleteColumn={deleteColumn} deleteTask={deleteTask}/>
                    ))}
                </div>
            </DndContext>
        </div>
    )
}

export default ColumnsContainer;
