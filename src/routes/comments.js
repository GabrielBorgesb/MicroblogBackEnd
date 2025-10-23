// GABRIEL BORGES 2269007
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const authMiddleware = require("../middlewares/auth");

// Criar comentário (requer autenticação)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content, post } = req.body;

    // Validação básica
    if (!content || content.trim() === "") {
      return res.status(400).json({
        error: "Conteúdo obrigatório",
        message: "O conteúdo do comentário é obrigatório",
      });
    }

    if (!post) {
      return res.status(400).json({
        error: "Post obrigatório",
        message: "O post é obrigatório",
      });
    }

    if (content.length > 280) {
      return res.status(400).json({
        error: "Conteúdo muito longo",
        message: "Comentário não pode exceder 280 caracteres",
      });
    }

    const comment = new Comment({
      content: content.trim(),
      author: req.session.userId,
      post: post,
    });

    await comment.save();
    await comment.populate("author", "username name");

    console.log(`Novo comentário criado por ${req.session.username}`);

    res.status(201).json({
      message: "Comentário criado com sucesso",
      comment: comment,
    });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    res.status(400).json({ error: error.message });
  }
});

// Buscar comentários por post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username name")
      .sort({ createdAt: -1 });

    res.json({
      message: "Comentários do post",
      comments: comments,
    });
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
