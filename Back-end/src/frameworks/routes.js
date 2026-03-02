const { Router } = require("express");
const userController = require("../controllers/userController");
const boxController = require("../controllers/boxController");

const routes = Router();

//Usuário
routes.get("/users/all", userController.getAllUsers);
routes.post("/users/register", userController.registerUser);
routes.post("/users/login", userController.loginUser);

//Boxes
routes.get("/boxes/all", boxController.getAllBoxes);
routes.post("/boxes", boxController.createBox);
routes.put("/boxes/:id", boxController.updateBox);
routes.delete("/boxes/:id", boxController.deleteBox);


module.exports = routes;