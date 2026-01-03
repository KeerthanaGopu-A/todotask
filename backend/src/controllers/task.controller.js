const Task = require("../models/task.model");

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            UserId: req.user.id
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { UserId: req.user.id }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ where: { id, UserId: req.user.id } });
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.update(req.body);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ where: { id, UserId: req.user.id } });
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.destroy();
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};
