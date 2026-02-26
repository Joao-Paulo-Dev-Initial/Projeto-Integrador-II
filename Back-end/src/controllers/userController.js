const users = require("../entities/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../Database/database");

async function getAllUsers(request, reply) {
    try {
        const replyDB = await users.findAll();
        reply.status(200).json(replyDB);
    } catch (error) {
        reply.status(404).json({error: error.message});
    }
}

async function registerUser(request, reply) {
    const { nome, email, senha, tipo } = request.body;

    try {
        const userExist = await users.findByEmail(email);

        if(userExist) {
            return reply.status(400).json({message: "Email já cadastrado."});
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const newUser = await users.create({
            nome,
            email,
            senha: hashedPassword,
            tipo
        });

        reply.status(201).json(newUser);

    } catch (error) {
        reply.status(404).json({error: error.message});
    }
}

async function loginUser(request, reply) {
    const { email, senha } = request.body;

    try {
        const user = await users.findByEmail(email);

        if(!user) {
            return reply.status(400).json({message: "Usuário não encontrado"})
        }
       
       const validPassword = await bcrypt.compare(senha, user.senha);
       
       if(!validPassword) {
            return reply.status(400).json({message: "Senha não encontrada"})
       }

       const token = jwt.sign(
        {id: user.id, tipo: user.tipo},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
       );

       reply.json({token});
    } catch (error) {
        reply.status(404).json({error: error.message});
    }
}

module.exports = { getAllUsers, registerUser, loginUser };