// GABRIEL BORGES 2269007
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Criar usuário
router.post("/", async (req, res) => {
  try {
    const { username, email, name, password, bio } = req.body;

    // Validação básica
    if (!username || !email || !name || !password) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "Username, email, nome e senha são obrigatórios",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        error: "Username muito curto",
        message: "Username deve ter pelo menos 3 caracteres",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Senha muito curta",
        message: "Senha deve ter pelo menos 6 caracteres",
      });
    }

    const user = new User({ username, email, name, password, bio });
    await user.save();

    console.log(`Novo usuário criado: ${username}`);

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Dados duplicados",
        message: "Username ou email já existe",
      });
    }

    res.status(400).json({ error: error.message });
  }
});

// Buscar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      message: "Lista de usuários",
      users: users,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Buscar usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
