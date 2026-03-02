const database = require("../Database/database");

async function findAllBoxes() {
    const result = await database.query("SELECT id, numero_box, nome_box, descricao, categoria, horario_func, contato FROM box");
    return result.rows;
}

async function createBox(box) {
    const { numero_box, nome_box, descricao, categoria, horario_func, contato, usuario_id } = box;

    const result = await database.query(
    `INSERT INTO box (
    numero_box, 
    nome_box, 
    descricao, 
    categoria, 
    horario_func, 
    contato, 
    usuario_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [numero_box, nome_box, descricao, categoria, horario_func, contato, usuario_id]
  );

  return result.rows[0];
}

async function updateBox(id, box) {
    const { numero_box, nome_box, descricao, categoria, horario_func, contato} = box;

    const result = await database.query(
        `UPDATE box SET 
        numero_box = $1, 
        nome_box = $2, 
        descricao = $3, 
        categoria = $4, 
        horario_func = $5, 
        contato = $6 
        WHERE id=$7
        RETURNING id, numero_box, nome_box, descricao, categoria, horario_func, contato`,
        [numero_box, nome_box, descricao, categoria, horario_func, contato, id]
    );

    return result.rows[0];
}

async function deleteBox(id) {
    await database.query("DELETE FROM box WHERE id = $1", [id]);
}



module.exports = { findAllBoxes, createBox, updateBox, deleteBox }