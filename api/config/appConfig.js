const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const APP_PORT = parseInt(process.env.APP_PORT)