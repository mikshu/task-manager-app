const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Save a Tasks
router.post("/", async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;
  try {
    const newTasks = new Task({ title, description, assignedTo, dueDate });
    await newTasks.save();
    res.status(201).json(newTasks);
  } catch (error) {
    res.status(500).json({ error: "Error creating tasks" });
  }
});
// Get All Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.status(201).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error in fetching tasks" });
  }
});

module.exports = router;
