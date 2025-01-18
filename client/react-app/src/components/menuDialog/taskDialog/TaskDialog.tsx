const TaskDialog: React.FC<{
    newTitle: string;
    newDesc: string;
    setNewTitle: (value: string) => void;
    setNewDesc: (value: string) => void;
    handleEditTask: () => void;
}> = ({ newTitle, newDesc, setNewTitle, setNewDesc, handleEditTask }) => {
    return (
        <div>
            <div>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    autoFocus
                />
            </div>
            <div>
                <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                />
            </div>
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleEditTask();
                }}
            >
                Confirm
            </button>
        </div>
    );
};

export default TaskDialog;
