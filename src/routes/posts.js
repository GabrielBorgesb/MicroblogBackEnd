// GABRIEL BORGES 2269007
const express = require("express");
const router = express.Router();
const PostRepository = require("../repositories/PostRepository");
const validate = require("../middlewares/validation");
const { postValidation } = require("../utils/validators"); // ADD THIS

// Criar post
router.post("/", validate(postValidation), async (req, res, next) => {
  try {
    const post = await PostRepository.create(req.body);
    res.status(201).json({
      message: "Post criado com sucesso",
      post: post,
    });
  } catch (error) {
    next(error);
  }
});

// Buscar todos os posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await PostRepository.findWithAuthor();
    res.json({
      message: "Lista de posts",
      posts: posts,
    });
  } catch (error) {
    next(error);
  }
});

// Buscar posts por termo
router.get("/search/:term", async (req, res, next) => {
  try {
    const posts = await PostRepository.searchPosts(req.params.term);
    res.json({
      message: `Posts encontrados para "${req.params.term}"`,
      posts: posts,
    });
  } catch (error) {
    next(error);
  }
});

// Curtir post
router.post("/:id/like", async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const post = await PostRepository.likePost(req.params.id, userId);

    res.json({
      message: "Post curtido",
      post: post,
    });
  } catch (error) {
    if (error.message === "Post não encontrado") {
      return res.status(404).json({ error: "Post não encontrado" });
    }
    next(error);
  }
});

// Descurtir post
router.post("/:id/unlike", async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const post = await PostRepository.unlikePost(req.params.id, userId);

    res.json({
      message: "Post descurtido",
      post: post,
    });
  } catch (error) {
    if (error.message === "Post não encontrado") {
      return res.status(404).json({ error: "Post não encontrado" });
    }
    next(error);
  }
});

module.exports = router;
