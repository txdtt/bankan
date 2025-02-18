const ColumnDialog: React.FC<{
    newTitle: string;
    setNewTitle: (value: string) => void;
    handleEditColumn: () => void;
}> = ({ newTitle, setNewTitle, handleEditColumn }) => {
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
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleEditColumn();
                }}
            >
                Confirm
            </button>
        </div>
    )
}

export default ColumnDialog;
