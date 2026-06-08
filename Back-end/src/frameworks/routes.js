const { Router } = require("express");
const upload = require("../frameworks/uploadConfig")

const userController = require("../controllers/userController");
const boxController = require("../controllers/boxController");
const favoritosController = require("../controllers/favoritosController");

const routes = Router();

routes.get("/", (req, res) => {
    res.send("Backend TáNaBox online");
});

routes.get("/teste", (req, res) => {
    res.send("API funcionando");
});

//Usuário
routes.get("/users/all", userController.getAllUsers);
routes.post("/users/register", userController.registerUser);
routes.post("/users/login", userController.loginUser);


//Boxes
routes.get("/boxes/all", boxController.getAllBoxes);
routes.get("/boxes/:id", boxController.getBoxById);
routes.get("/boxes/user/:id", boxController.getBoxByUser);
routes.post("/boxes", upload.single("imagem"), boxController.createBox);
routes.put("/boxes/:id", upload.single("imagem"), boxController.updateBox);
routes.delete("/boxes/:id", boxController.deleteBox);

//Favoritos
routes.post("/favoritos", favoritosController.createFavorito);
routes.get("/favoritos/:usuario_id", favoritosController.getFavoritosByUser);
routes.delete("/favoritos/delete/:id", favoritosController.deleteFavorito);


module.exports = routes;