const database = require("../Database/database");

async function findAllBoxes() {
    const result = await database.query(`
        SELECT 
            id,
            numero_box, 
            nome_box, 
            descricao, 
            categoria, 
            horario_func, 
            horario_fech,
            contato,
            imagem 
        FROM box
    `);

    return result.rows;
}

async function findBoxById(id) {
    const result = await database.query(
        `
        SELECT 
            id,
            numero_box, 
            nome_box, 
            descricao, 
            categoria, 
            horario_func,
            horario_fech, 
            contato,
            imagem
        FROM box
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}

async function createBox(box) {
    const {
        numero_box,
        nome_box,
        descricao,
        categoria,
        horario_func,
        horario_fech,
        contato,
        usuario_id,
        imagem
    } = box;

    const result = await database.query(
        `
        INSERT INTO box (
            numero_box,
            nome_box,
            descricao,
            categoria,
            horario_func,
            horario_fech,
            contato,
            usuario_id,
            imagem
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
            numero_box,
            nome_box,
            descricao,
            categoria,
            horario_func,
            horario_fech,
            contato,
            usuario_id,
            imagem
        ]
    );

    return result.rows[0];
}

async function updateBox(id, box) {
    const {
        numero_box,
        nome_box,
        descricao,
        categoria,
        horario_func,
        contato,
        imagem,
        horario_fech
    } = box;

    const current = await database.query(
        `SELECT imagem FROM box WHERE id = $1`,
        [id]
    );

    const imagemAtual = current.rows[0]?.imagem;
    const imagemFinal = imagem || imagemAtual;

    const result = await database.query(
        `
        UPDATE box SET
            numero_box = $1,
            nome_box = $2,
            descricao = $3,
            categoria = $4,
            horario_func = $5,
            contato = $6,
            imagem = $7,
            horario_fech = $8
        WHERE id = $9
        RETURNING *
        `,
        [
            numero_box,
            nome_box,
            descricao,
            categoria,
            horario_func,
            contato,
            imagemFinal,
            horario_fech,
            id
        ]
    );

    return result.rows[0];
}

async function deleteBox(id) {
    await database.query(
        `DELETE FROM box WHERE id = $1`,
        [id]
    );
}

async function findBoxByUserId(usuario_id) {
    const result = await database.query(
        `
        SELECT 
            id,
            numero_box,
            nome_box,
            descricao,
            categoria,
            horario_func,
            horario_fech,
            contato,
            usuario_id,
            imagem
        FROM box
        WHERE usuario_id = $1
        `,
        [usuario_id]
    );

    return result.rows[0];
}

module.exports = {findAllBoxes, findBoxById, createBox, updateBox, deleteBox, findBoxByUserId};