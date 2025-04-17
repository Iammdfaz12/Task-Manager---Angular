const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers");

// Get all the tasks
router.get("/", taskController.getTask);

// Create a new task
router.post("/", taskController.createTask);

// Update a task
router.put("/:id", taskController.updateTask);

// Delete task
router.delete("/:id", taskController.deleteTasks);

module.exports = router;
