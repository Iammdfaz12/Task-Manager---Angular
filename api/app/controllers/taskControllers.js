const { json } = require("body-parser");
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
  console.log(req.body);
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
  const taskIndex = tasks.findIndex((task) => task.id == req.params.id);

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
  const filteredTasks = tasks.filter((task) => task.id != req.params.id);

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ message: "Task Not found" });
  }

  writeData(filteredTasks);
  res.status(200).json({ message: "Task deleted" });
};
