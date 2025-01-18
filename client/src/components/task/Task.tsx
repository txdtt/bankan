import styles from './Task.module.css';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities'

import { TaskModel } from '../../models/taskModel';
import { mergeRefs } from 'react-merge-refs';

const Task: React.FC<{
    task: TaskModel; 
    columnId: string;
    openEditDialog: (task: TaskModel) => void; 
    handleDeleteTask: (columnId: string, taskId: string) => void;
}> = ({ task, columnId, openEditDialog, handleDeleteTask }) => {
    const {attributes, listeners, setNodeRef: setDraggableRef, transform} = useDraggable({
        id: `${columnId}:${task._id}`,
    });

    const {setNodeRef: setDroppableRef} = useDroppable({
        id: `${columnId}:${task._id}`
    })

    const combinedRefs = mergeRefs([setDraggableRef, setDroppableRef]);

    const transStyle = transform ? {
        transform: CSS.Translate.toString(transform),
        border: "1px solid gray",
        padding: "8px",
        background: "white",
        cursor: "grab",
    } : undefined;

    return (
        <div className={styles.task} style={transStyle}>
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    openEditDialog(task);
                }}
            >
                Edit Task
            </button>
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleDeleteTask(columnId, task._id);
                }}
            >
                Delete Task
            </button>
            <div ref={combinedRefs} {...listeners} {...attributes}>
                <div>{task.title}</div>
                <div>{task.description}</div>
            </div>
        </div>
    )
}

export default Task;
