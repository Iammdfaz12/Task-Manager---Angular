const { json } = require("body-parser");
const { log } = require("console");
const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../../dataAccess/data.json");

const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Getting All the tasks
exports.getTask = (req, res) => {
  const tasks = readData();
  res.status(200).json(tasks);
};

// Creating new tasks
exports.createTask = (req, res) => {
  const tasks = readData();
  const newTask = {
    ...req.body,
    id: req.body.id,
  };

  tasks.push(newTask);
  writeData(tasks);
  res.status(200).json(newTask);
};

// Updating tasks
exports.updateTask = (req, res) => {
  const tasks = readData();
  const taskId = parseInt(req.params.id);

  const taskIndex = tasks.findIndex(task => task.id === taskId);

  console.log("Founded index value in db: ", taskIndex);
  console.log("Task data came from web: ", req.body);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updatedTask = { ...tasks[taskIndex], ...req.body };
  tasks[taskIndex] = updatedTask;

  writeData(tasks);
  res.status(200).json(updatedTask);
};

// Delete tasks
exports.deleteTasks = (req, res) => {
  const tasks = readData();
  const index = parseInt(req.params.id); // Treat ID as index

  if (isNaN(index) || index < 0 || index >= tasks.length) {
    return res.status(404).json({ message: "Invalid task index" });
  }

  tasks.splice(index, 1); // Remove task at index
  writeData(tasks); // Save the updated list

  return res.status(200).json({ message: "Task deleted successfully" });
};
