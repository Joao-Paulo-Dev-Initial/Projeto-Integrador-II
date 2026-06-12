require("dotenv").config();

const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const server = express();
const port = process.env.PORT || 8080;

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(port, () => console.log(`Server ON na porta ${port}`));