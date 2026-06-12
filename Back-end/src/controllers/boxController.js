const boxes = require("../entities/boxes");

async function getAllBoxes(request, reply) {
  try {
    const replyDB = await boxes.findAllBoxes();
    reply.json(replyDB);
  } catch (error) {
    reply.status(404).json({ error: error.message });
  }
}

async function getBoxById(request, reply) {
  try {
    const { id } = request.params;
    const box = await boxes.findBoxById(id);

    if (!box) {
      return reply.status(404).json({ message: "Box não encontrado" });
    }

    reply.json(box);
  } catch (error) {
    reply.status(404).json({ error: error.message });
  }
}

async function createBox(request, reply) {
  try {

      console.log("==== BODY RECEBIDO ====");
      console.log(request.body); // aqui vemos todos os campos que chegaram do frontend
      console.log("==== ARQUIVO RECEBIDO ====");
      console.log(request.file); // aqui vemos se Multer capturou a imagem

      if (request.file) {
    console.log("Arquivo recebido pelo multer:", request.file);
    console.log("Nome do arquivo:", request.file.filename); // <- aqui é o que você quer
} else {
    console.log("Nenhum arquivo recebido!");
}

    const {usuario_id, numero_box, nome_box, descricao, categoria, horario_func, horario_fech, contato} = request.body;

    if(!usuario_id || !numero_box || !nome_box) {
      return reply.status(400).json({error: "usuario_id obrigatório"});
    }

    const userIdNumber = Number(usuario_id);
    const existingBox = await boxes.findBoxByUserId(usuario_id);

    if(existingBox) {
      return reply.status(400).json({
        message: "Você já possui uma box cadastrada!"
      });
    }

    const imageUrl = request.file
      ? request.file.path
      : null;
    
    const newBox = await boxes.createBox({
      numero_box,
          nome_box,
          descricao,
          categoria,
          horario_func,
          horario_fech,
          contato,
          usuario_id: userIdNumber,
          imagem: imageUrl
    });

    reply.status(201).json(newBox);
  } catch (error) {
    console.log("Erro ao criar box: ", error)
    reply.status(500).json({ error: error.message });
  }
}

async function updateBox(request, reply) {
    try {
    const { id } = request.params;

    const imageUrl = request.file
      ? request.file.path
      : null;

    const updatedBox = await boxes.updateBox(id, {
      ...request.body,
      imagem: imageUrl
    });

    if (!updatedBox) {
      return reply.status(404).json({ message: "Box não encontrado" });
    }

    reply.json(updatedBox);

  } catch (error) {
    reply.status(404).json({ error: error.message });
  }
}

async function deleteBox(request, reply) {
  try {
    await boxes.deleteBox(request.params.id);
    reply.json({ message: "Box deletado com sucesso" });
  } catch (error) {
    reply.status(404).json({ error: error.message });
  }
}

async function getBoxByUser(request, reply) {
    const { id } = request.params;

    try {
        const box = await boxes.findBoxByUserId(id);

        if (!box) {
            return reply.status(404).json({ message: "Usuário não possui box" });
        }

        reply.json(box);
    } catch (error) {
        reply.status(500).json({ error: error.message });
    }
}

module.exports = { getAllBoxes, getBoxById, createBox, updateBox, deleteBox, getBoxByUser };