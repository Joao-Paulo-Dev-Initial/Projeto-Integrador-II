require("dotenv").config();

const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const path = require("path");

const server = express();
const port = process.env.PORT || 8080;

server.use(cors());
server.use(express.json());
server.use("/uploads", express.static(path.join(__dirname, "uploads")));
server.use(routes);

server.listen(port, () => console.log(`Server ON na porta ${port}`));