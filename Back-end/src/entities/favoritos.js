const database = require("../Database/database");

async function createFavorito(favorito) {
    const { usuario_id, box_id, observacao } = favorito;

    const result = await database.query(
        `INSERT INTO favorito (
            usuario_id,
            box_id,
            observacao
        ) VALUES ($1, $2, $3)
        RETURNING id, usuario_id, box_id, observacao`,
        [usuario_id, box_id, observacao]
    );

    return result.rows[0];
}

async function findByUserId(usuario_id) {
    const result = await database.query(
        `SELECT 
            f.id,
            f.observacao,
            b.numero_box,
            b.nome_box,
            b.descricao
         FROM favorito f
         JOIN box b ON b.id = f.box_id
         WHERE f.usuario_id = $1`,
        [usuario_id]
    );

    return result.rows;
}

async function deleteFavorito(id) {
    const result = await database.query(
        `DELETE FROM favorito WHERE id = $1 RETURNING *`,
        [id]
    );

    return result.rows[0]; // retorna undefined se não existir
}

module.exports = {
    createFavorito,
    findByUserId,
    deleteFavorito
};