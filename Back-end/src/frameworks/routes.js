const { Router } = require("express");
const userController = require("../controllers/userController");
const boxController = require("../controllers/boxController");
const favoritosController = require("../controllers/favoritosController");

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

//Favoritos
routes.post("/favoritos", favoritosController.createFavorito);
routes.get("/favoritos/:usuario_id", favoritosController.getFavoritosByUser);
routes.delete("/favoritos/delete/:id", favoritosController.deleteFavorito);


module.exports = routes;