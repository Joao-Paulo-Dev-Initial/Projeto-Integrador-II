const database = require("../Database/database");

async function findAll() {
    const result = await database.query(`SELECT id, nome, email, tipo FROM usuario`);
    return result.rows;
}

async function findByEmail(email) {
    const result = await database.query(`SELECT * FROM usuario WHERE email = $1`, [email]);
    return result.rows[0];
}

async function create(userData) {
    const { nome, email, senha, tipo } = userData;

    const result = await database.query (
        `INSERT INTO usuario (
        nome, 
        email, 
        senha, 
        tipo
        ) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo`,
        [nome, email, senha, tipo]
    );

    return result.rows[0];
}

module.exports = { findAll, findByEmail, create };