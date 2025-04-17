const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const taskRoutes = require("./app//routes/taskRoutes");

const app = express();

// Middlewares
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Server Started...");
});
