// GABRIEL BORGES 2269007
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middlewares/auth");

// Criar post (requer autenticação)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content, tags } = req.body;

    // Validação básica
    if (!content || content.trim() === "") {
      return res.status(400).json({
        error: "Conteúdo obrigatório",
        message: "O conteúdo do post é obrigatório",
      });
    }

    if (content.length > 280) {
      return res.status(400).json({
        error: "Conteúdo muito longo",
        message: "Post não pode exceder 280 caracteres",
      });
    }

    const post = new Post({
      content: content.trim(),
      author: req.session.userId,
      tags: tags || [],
    });

    await post.save();
    await post.populate("author", "username name");

    console.log(`Novo post criado por ${req.session.username}`);

    res.status(201).json({
      message: "Post criado com sucesso",
      post: post,
    });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    res.status(400).json({ error: error.message });
  }
});

// Buscar todos os posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username name")
      .sort({ createdAt: -1 });

    res.json({
      message: "Lista de posts",
      posts: posts,
    });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Buscar posts por termo
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: "Termo de busca é obrigatório",
      });
    }

    const posts = await Post.find({
      $or: [
        { content: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
    })
      .populate("author", "username name")
      .sort({ createdAt: -1 });

    res.json({
      message: `Posts encontrados para "${q}"`,
      posts: posts,
    });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Curtir post (requer autenticação)
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.session.userId },
      },
      { new: true }
    ).populate("author", "username name");

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    // Atualizar contador
    post.likesCount = post.likes.length;
    await post.save();

    console.log(`Post ${req.params.id} curtido por ${req.session.username}`);

    res.json({
      message: "Post curtido",
      post: post,
    });
  } catch (error) {
    console.error("Erro ao curtir post:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Descurtir post (requer autenticação)
router.post("/:id/unlike", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.session.userId },
      },
      { new: true }
    ).populate("author", "username name");

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    // Atualizar contador
    post.likesCount = post.likes.length;
    await post.save();

    console.log(`Post ${req.params.id} descurtido por ${req.session.username}`);

    res.json({
      message: "Post descurtido",
      post: post,
    });
  } catch (error) {
    console.error("Erro ao descurtir post:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
