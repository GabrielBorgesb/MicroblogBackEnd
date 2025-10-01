// GABRIEL BORGES 2269007
const express = require("express");
const router = express.Router();
const UserRepository = require("../repositories/UserRepository");
const validate = require("../middlewares/validation");
const { userValidation } = require("../utils/validators");

// Criar usuario
router.post("/", validate(userValidation), async (req, res, next) => {
  try {
    const user = await UserRepository.create(req.body);
    res.status(201).json({
      message: "Usuario criado com sucesso",
      user: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Usuario ou email ja existe",
      });
    }
    next(error);
  }
});

// Buscar todos os usuarios
router.get("/", async (req, res, next) => {
  try {
    const users = await UserRepository.find();
    res.json({
      message: "Lista de usuarios",
      users: users,
    });
  } catch (error) {
    next(error);
  }
});

// Buscar usuario por ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await UserRepository.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Deletar usuario
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await UserRepository.delete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }
    res.json({ message: "Usuario deletado com sucesso" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
