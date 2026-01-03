import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../features/taskSlice";
import { toast } from "react-toastify";

const TaskForm = () => {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("Medium");
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        dispatch(createTask({ title, dueDate, priority, status: "Todo" }))
            .then((res) => {
                if (!res.error) toast.success("Task added successfully!");
            });
        setTitle("");
        setDueDate("");
        setPriority("Medium");
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "20px", marginBottom: "30px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new task..."
                style={{ margin: 0, flex: "2 1 200px", background: "rgba(255,255,255,0.05)", border: "none" }}
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ margin: 0, flex: "1 1 '100px'", background: "rgba(255,255,255,0.05)", border: "none", color: "var(--text-main)" }}
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ margin: 0, flex: "0 1 100px", background: "rgba(255,255,255,0.05)", border: "none", color: "var(--text-main)" }}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                + Add
            </button>
        </form>
    );
};

export default TaskForm;
