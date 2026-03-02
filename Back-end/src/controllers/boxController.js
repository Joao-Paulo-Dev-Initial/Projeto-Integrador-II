const boxes = require("../entities/boxes");

async function getAllBoxes(request, reply) {
  try {
    const replyDB = await boxes.findAllBoxes();
    reply.json(replyDB);
  } catch (error) {
    reply.status(404).json({ error: error.message });
  }
}

async function createBox(request, reply) {
  try {
    const newBox = await boxes.createBox(request.body);
    reply.status(201).json(newBox);
  } catch (error) {
    reply.status(404).json({ error: error.message });
  }
}

async function updateBox(request, reply) {
    try {
    const { id } = request.params;

    const updatedBox = await boxes.updateBox(id, request.body);

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

module.exports = { getAllBoxes, createBox, updateBox, deleteBox };