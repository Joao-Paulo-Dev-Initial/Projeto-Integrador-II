const { Router } = require("express");
const userController = require("../controllers/userController")

const routes = Router();

routes.get("/users/all", userController.getAllUsers);
routes.post("users/register", userController.registerUser);

module.exports = routes;