// GABRIEL BORGES 2269007
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "Username e senha são obrigatórios",
      });
    }

    // Buscar usuário
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: "Credenciais inválidas",
        message: "Usuário ou senha incorretos",
      });
    }

    // Verificar senha
    const validPassword = user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({
        error: "Credenciais inválidas",
        message: "Usuário ou senha incorretos",
      });
    }

    // Criar sessão
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.name = user.name;

    console.log(`Usuário ${username} fez login`);

    res.json({
      message: "Login realizado com sucesso",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  const username = req.session.username;
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro no logout:", err);
      return res.status(500).json({ error: "Erro ao fazer logout" });
    }
    console.log(`Usuário ${username} fez logout`);
    res.json({ message: "Logout realizado com sucesso" });
  });
});

// VERIFICAR SESSÃO
router.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  res.json({
    user: {
      id: req.session.userId,
      username: req.session.username,
      name: req.session.name,
    },
  });
});

module.exports = router;
