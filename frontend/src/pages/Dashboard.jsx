import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, updateTask, deleteTask } from "../features/taskSlice";
import { logout } from "../features/authSlice";
import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list: tasks, loading, error } = useSelector((state) => state.tasks);
    const { token, user } = useSelector((state) => state.auth);

    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState("All");
    const [sortBy, setSortBy] = useState("priority"); // priority | date

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            dispatch(fetchTasks());
        }
    }, [token, dispatch, navigate]);

    const handleStatusChange = (id, currentStatus) => {
        const statuses = ["Todo", "In Progress", "Completed"];
        const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % 3];
        dispatch(updateTask({ id, data: { status: nextStatus } }))
            .then(() => toast.info(`Task moved to ${nextStatus}`));
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this task?")) {
            dispatch(deleteTask(id))
                .then(() => toast.error("Task deleted"));
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    // Filter Logic
    const filteredTasks = tasks.filter(task => {
        const statusMatch = filterStatus === "All" || task.status === filterStatus;
        const priorityMatch = filterPriority === "All" || (task.priority || "Medium") === filterPriority;
        return statusMatch && priorityMatch;
    });

    // Sort Logic
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === "priority") {
            const pA = priorityOrder[a.priority || "Medium"];
            const pB = priorityOrder[b.priority || "Medium"];
            return pB - pA;
        } else if (sortBy === "date") {
            const dateA = new Date(a.dueDate || "9999-12-31");
            const dateB = new Date(b.dueDate || "9999-12-31");
            return dateA - dateB;
        }
        return 0;
    });

    // Chart Data
    const data = {
        labels: ["Todo", "In Progress", "Completed"],
        datasets: [{
            data: [
                tasks.filter(t => t.status === "Todo").length,
                tasks.filter(t => t.status === "In Progress").length,
                tasks.filter(t => t.status === "Completed").length
            ],
            backgroundColor: ["#ff4d6d", "#9d4edd", "#00b4d8"],
            borderColor: "transparent",
            borderWidth: 0,
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: "#e0e0e0",
                    font: { family: 'Outfit', size: 12 },
                    padding: 20,
                    usePointStyle: true
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%'
    };

    // Status Styling
    const getStatusColor = (status) => {
        switch (status) {
            case "Todo": return "#ff4d6d";
            case "In Progress": return "#9d4edd";
            case "Completed": return "#00b4d8";
            default: return "#fff";
        }
    };

    // Priority Styling
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "rgba(255, 77, 109, 0.2)";
            case "Medium": return "rgba(255, 209, 102, 0.2)";
            case "Low": return "rgba(0, 180, 216, 0.2)";
            default: return "rgba(255, 255, 255, 0.1)";
        }
    };

    const getPriorityTextColor = (priority) => {
        switch (priority) {
            case "High": return "#ff4d6d";
            case "Medium": return "#ffd166";
            case "Low": return "#00b4d8";
            default: return "#fff";
        }
    };

    if (loading && tasks.length === 0) return (
        <div className="animated-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "white" }}>
            <h2>Loading workspace...</h2>
        </div>
    );

    return (
        <div className="animated-bg" style={{ minHeight: "100vh", padding: "40px 20px" }}>
            <div style={{ maxWidth: "1200px", margin: "auto" }}>

                {/* Header */}
                <header className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: "40px" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "2.8rem", fontWeight: "700", letterSpacing: "-1px" }}>
                            Hello, <span style={{ background: "linear-gradient(to right, #9d4edd, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user?.name || "User"}</span>
                        </h1>
                        <p style={{ color: "var(--text-muted)", margin: "8px 0 0", fontSize: "1.1rem" }}>Let's be productive today.</p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        Sign Out
                    </button>
                </header>

                {error && <div className="glass-panel" style={{ padding: "15px", color: "#ff4d6d", marginBottom: "20px", border: "1px solid #ff4d6d" }}>{error}</div>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", alignItems: "start" }}>

                    {/* Left Column: Stats */}
                    <div className="glass-panel fade-in" style={{ padding: "30px", textAlign: "center", position: "sticky", top: "20px" }}>
                        <h3 style={{ marginBottom: "25px", fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: "500" }}>Task Overview</h3>
                        <div style={{ height: "260px", position: "relative", marginBottom: "20px" }}>
                            <Pie data={data} options={chartOptions} />
                            <div style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -60%)",
                                textAlign: "center"
                            }}>
                                <span style={{ fontSize: "2.5rem", fontWeight: "700", display: "block", lineHeight: "1" }}>{tasks.length}</span>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Tasks</span>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px" }}>
                                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#00b4d8" }}>{tasks.filter(t => t.status === "Completed").length}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Done</div>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px" }}>
                                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#9d4edd" }}>{tasks.filter(t => t.status === "In Progress").length}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tasks */}
                    <div className="fade-in" style={{ animationDelay: "0.2s" }}>
                        <TaskForm />

                        <div className="glass-panel" style={{ padding: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                                <h3 style={{ margin: 0, fontSize: "1.3rem" }}>My Tasks</h3>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--primary)", background: "rgba(157, 78, 221, 0.1)", color: "var(--text-main)", width: "auto", margin: 0, fontSize: "0.9rem" }}
                                    >
                                        <option value="priority">Sort: Priority</option>
                                        <option value="date">Sort: Date</option>
                                    </select>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "var(--text-main)", width: "auto", margin: 0, fontSize: "0.9rem" }}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Todo">Todo</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <select
                                        value={filterPriority}
                                        onChange={(e) => setFilterPriority(e.target.value)}
                                        style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "var(--text-main)", width: "auto", margin: 0, fontSize: "0.9rem" }}
                                    >
                                        <option value="All">All Priorities</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            {sortedTasks.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)", border: "2px dashed var(--glass-border)", borderRadius: "12px" }}>
                                    <p style={{ fontSize: "1.1rem" }}>✨ No tasks found.</p>
                                    <p style={{ fontSize: "0.9rem" }}>Add a new task to get started!</p>
                                </div>
                            ) : (
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {sortedTasks.map((task, index) => (
                                        <li key={task.id}
                                            className="fade-in"
                                            style={{
                                                background: "rgba(255,255,255,0.02)",
                                                border: "1px solid rgba(255,255,255,0.05)",
                                                borderRadius: "16px",
                                                padding: "20px",
                                                marginBottom: "15px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                transition: "all 0.3s ease",
                                                animationDelay: `${index * 0.05}s`
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
                                                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "none";
                                                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

                                                {/* Status Indicator */}
                                                <div
                                                    onClick={() => handleStatusChange(task.id, task.status)}
                                                    style={{
                                                        width: "16px",
                                                        height: "16px",
                                                        borderRadius: "50%",
                                                        border: `3px solid ${getStatusColor(task.status)}`,
                                                        cursor: "pointer",
                                                        boxShadow: `0 0 15px ${getStatusColor(task.status)}`,
                                                        background: task.status === "Completed" ? getStatusColor(task.status) : "transparent",
                                                        transition: "all 0.3s ease",
                                                        flexShrink: 0
                                                    }}
                                                    title="Toggle Status"
                                                />

                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                                                        <span style={{
                                                            fontWeight: "600",
                                                            fontSize: "1.1rem",
                                                            color: task.status === "Completed" ? "var(--text-muted)" : "var(--text-main)",
                                                            textDecoration: task.status === "Completed" ? "line-through" : "none",
                                                            transition: "all 0.3s"
                                                        }}>
                                                            {task.title}
                                                        </span>

                                                        <span style={{
                                                            fontSize: "0.7rem",
                                                            padding: "4px 10px",
                                                            borderRadius: "20px",
                                                            background: getPriorityColor(task.priority),
                                                            color: getPriorityTextColor(task.priority),
                                                            fontWeight: "700",
                                                            letterSpacing: "0.5px"
                                                        }}>
                                                            {task.priority || "MEDIUM"}
                                                        </span>
                                                    </div>

                                                    <div style={{
                                                        fontSize: "0.85rem",
                                                        color: "var(--text-muted)",
                                                        display: "flex",
                                                        gap: "15px",
                                                        alignItems: "center"
                                                    }}>
                                                        <span
                                                            style={{ color: getStatusColor(task.status), cursor: "pointer", fontWeight: "500", letterSpacing: "0.5px" }}
                                                            onClick={() => handleStatusChange(task.id, task.status)}
                                                        >
                                                            {task.status.toUpperCase()}
                                                        </span>
                                                        {task.dueDate && (
                                                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                                {task.dueDate}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="btn"
                                                style={{
                                                    background: "rgba(255, 77, 109, 0.1)",
                                                    color: "#ff4d6d",
                                                    padding: "8px 12px",
                                                    borderRadius: "8px",
                                                    fontSize: "0.9rem"
                                                }}
                                                title="Delete"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
