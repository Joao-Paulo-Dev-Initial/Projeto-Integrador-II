const favoritos = require("../entities/favoritos");

async function createFavorito(request, reply) {
    try {
        const newFavorito = await favoritos.createFavorito(request.body);
        
        reply.status(201).json(newFavorito);
    } catch (error) {
        reply.status(404).json({ error: error.message });
    }
}

async function getFavoritosByUser(request, reply) {
    try {
        const { usuario_id } = request.params;
        const result = await favoritos.findByUserId(usuario_id);

        reply.status(200).json(result);
    } catch (error) {
        reply.status(404).json({ error: error.message });
    }
}

async function deleteFavorito(request, reply) {
    try {
        const { id } = request.params;
        const deleted = await favoritos.deleteFavorito(id);

        if (!deleted) {
            return reply.status(404).json({
                message: "Favorito não encontrado"
            });
        }
        reply.json({
            message: "Favorito deletado com sucesso"
        });

    } catch (error) {
        reply.status(500).json({ error: error.message });
    }
}

module.exports = {
    createFavorito,
    getFavoritosByUser,
    deleteFavorito
};