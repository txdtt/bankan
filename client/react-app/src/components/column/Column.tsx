import { useState } from 'react';
import styles from './Column.module.css';
import Task from '../task/Task';

import { useDroppable } from '@dnd-kit/core';

import { ColumnModel } from '../../models/columnModel';
import { TaskModel } from '../../models/taskModel';

import { v4 as uuidv4 } from 'uuid';

import TaskDialog from '../menuDialog/taskDialog/TaskDialog';

const Column: React.FC<{
    column: ColumnModel, 
    moveTaskNewColumn: (columnId: string, newTask: TaskModel) => void,
    editTask: (columnId: string, taskId: string, updatedTask: TaskModel) => void,
    deleteColumn: (columnId: string) => void,
    deleteTask: (columnId: string, taskId: string) => void
}> = ({ column, moveTaskNewColumn, editTask, deleteTask, deleteColumn }) => {

    const [columnTitle, setColumnTitle] = useState(column.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");

    const { setNodeRef } = useDroppable({
        id: column._id,
    });

    const addTask = () => {
        const newTask: TaskModel = {
            _id: uuidv4(),
            title: newTaskTitle,
            description: newTaskDesc,
        };
        moveTaskNewColumn(column._id, newTask)
        setNewTaskTitle("");
        setNewTaskDesc("");
        setIsAddingTask(false);
    }

    const editColumnTitle = (newColumnTitle: string) => {
        setColumnTitle(newColumnTitle);
        setIsEditingTitle(false);
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskModel | null>(null);

    const openEditDialog = (task: TaskModel) => {
        setEditingTask(task);
        setIsEditing(true);
    };

    const handleEditTask = (newTitle: string, newDesc: string) => {
        if (editingTask) {
            const updatedTask: TaskModel = {
                ...editingTask,
                title: newTitle || editingTask.title,
                description: newDesc || editingTask.description,
            };
            editTask(column._id, editingTask._id, updatedTask);
            setEditingTask(null);
            setIsEditing(false);
        }
    };

    const handleDeleteTask = (columnId: string, taskId: string) => {
        deleteTask(columnId, taskId);
    }


    const handleDeleteColumn = (columnId: string) => {
        deleteColumn(columnId);
    }

    return (
        <div className={styles.column}>
            <div className={styles.title}>{columnTitle}</div>
            {isEditingTitle ? (
                <div>
                    <input 
                        type="text"
                        placeholder={columnTitle}
                        onBlur={(e) => editColumnTitle(e.target.value)}
                        autoFocus
                    />
                </div>
            ) : (
                <button onClick={() => setIsEditingTitle(true)}>Edit Title</button>
            )}
            <button onClick={() => handleDeleteColumn(column._id)}>Delete</button>
            <div ref={setNodeRef}>
                {column.tasks.map((task) => (
                    <Task
                        key={task._id}
                        task={task}
                        columnId={column._id}
                        openEditDialog={openEditDialog}
                        handleDeleteTask={handleDeleteTask}
                    />
                ))}
                {isEditing && editingTask && (
                    <TaskDialog
                        newTitle={editingTask.title}
                        newDesc={editingTask.description}
                        setNewTitle={(value) => setEditingTask({ ...editingTask, title: value })}
                        setNewDesc={(value) => setEditingTask({ ...editingTask, description: value })}
                        handleEditTask={() => handleEditTask(editingTask.title, editingTask.description)}
                    />
                )}
            </div>
            {isAddingTask ? (
                <div>
                    <div>
                        <input 
                            type="text"
                            value={newTaskTitle}
                            placeholder="Task Title"
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <input 
                            type="text"
                            value={newTaskDesc}
                            placeholder="Task Description"
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                        />
                    </div>
                    <button onClick={() => addTask()}>Submit Task</button>
                </div>
            ) : (
                <button onClick={() => setIsAddingTask(true)}>Add Task</button>
            )}
        </div>
    )
}

export default Column;
