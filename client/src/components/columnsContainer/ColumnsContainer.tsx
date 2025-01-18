import { useState } from 'react';
import Column from '../column/Column';
import styles from './ColumnsContainer.module.css'
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import ColumnModel from '../../models/columnModel';

import { v4 as uuidv4 } from 'uuid';
import TaskModel from '../../models/taskModel';

const ColumnsContainer = () => {
    const [columns, setColumns] = useState<ColumnModel[]>([]);
    const [isAddingColumn, setIsAddingColumn] = useState(false);

    const addColumn = (columnTitle: string) => {
        if (columnTitle.trim() === "") {
            return;
        }
        const newColumn: ColumnModel = {
            _id: uuidv4(),
            title: columnTitle,
            tasks: [],
        };
        setColumns([...columns, newColumn]);
        setIsAddingColumn(false);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) 
            return;

        const [fromColumnId, taskId] = (active.id as string).split(":");
        const [toColumnId, targetTaskId]= (over.id as string).split(":");

        if (fromColumnId !== toColumnId) {
            setColumns((prevColumns) => {
                const fromColumnIndex = prevColumns.findIndex((col) => col._id === fromColumnId);
                const toColumnIndex = prevColumns.findIndex((col) => col._id === toColumnId);

                const fromTasks = [...prevColumns[fromColumnIndex].tasks];
                const fromTaskIndex = fromTasks.findIndex((task) => task._id === taskId);

                const toTasks = [...prevColumns[toColumnIndex].tasks];
                const toTaskIndex = toTasks.findIndex((task) => task._id === targetTaskId);
                
                const [movedTask] = fromTasks.splice(fromTaskIndex, 1);
                toTasks.splice(toTaskIndex, 0, movedTask);

                const updatedColumns = [...prevColumns];
                updatedColumns[fromColumnIndex].tasks = fromTasks;
                updatedColumns[toColumnIndex].tasks = toTasks;

                return updatedColumns;
            })
        } else {
            setColumns((prevColumns) => {
                const columnIndex = prevColumns.findIndex((col) => col._id === fromColumnId);
                const tasks = [...prevColumns[columnIndex].tasks];

                const fromTaskIndex = tasks.findIndex((task) => task._id === taskId);
                const toTaskIndex = tasks.findIndex((task) => task._id === targetTaskId) ;

                const [movedTask] = tasks.splice(fromTaskIndex, 1);
                tasks.splice(toTaskIndex, 0, movedTask);

                const updatedColumns = [...prevColumns];
                updatedColumns[columnIndex].tasks = tasks;

                return updatedColumns;
            })
        }
    };

    const moveTaskNewColumn = (columnId: string, newTask: TaskModel) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) => 
                col._id === columnId 
                    ? {...col, tasks: [...col.tasks, newTask]}
                    : col
            )
        );
    };

    const editTask = (columnId: string, taskId: string, updatedTask: TaskModel) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col._id === columnId
                    ? {
                        ...col,
                        tasks: col.tasks.map((task) =>
                            task._id === taskId ? updatedTask : task
                        ),
                    }
                    : col
            )
        );
    };

    const deleteColumn = (columnId: string) => {
        setColumns((prevColumns) =>
            prevColumns.filter((col) => col._id !== columnId)
        );
    };

    const deleteTask = (columnId: string, taskId: string) => {
        console.log("columnId: ", columnId);
        console.log("taskId: ", taskId);
        setColumns((prevColumns) =>
            prevColumns.map((col) => 
                col._id === columnId
                ? {
                    ...col,
                    tasks: col.tasks.filter((task) => task._id !== taskId),
                }  
                : col       
            )
        )
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
