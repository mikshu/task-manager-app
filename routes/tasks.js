const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Save a Tasks
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, assignedTo, dueDate, status } = req.body;
  try {
    const newTasks = new Task({
      title,
      description,
      assignedTo,
      dueDate,
      status,
      createdBy: req.user.userId,
    });
    await newTasks.save();
    res.status(201).json(newTasks);
  } catch (error) {
    res.status(500).json({ error: "Error creating tasks" });
  }
});
// Get All Tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.status(201).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error in fetching tasks" });
  }
});

// Update Task
router.put("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const { title, description, assignedTo, dueDate, status } = req.body;
  try {
    const task = await Task.findById(id);
    if (!task) {
      res.status(500).json({ error: "Task not found!" });
    }
    // Ensure the user updating the task is the one who created it
    if (task.createdBy.toString() !== req.user.userId) {
      res.status(403).json({ error: "Unauthorized User updating task" });
    }
    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;

    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});
// Delete a Task
router.delete("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (!task) {
      res.status(500).json({ error: "Task not found!" });
    }
    // Ensure the user updating the task is the one who created it
    if (task.createdBy.toString() !== req.user.userId) {
      res.status(403).json({ error: "Unauthorized User updating task" });
    }

    await task.remove();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
