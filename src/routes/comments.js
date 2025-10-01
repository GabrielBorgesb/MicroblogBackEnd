// GABRIEL BORGES 2269007
const express = require("express");
const router = express.Router();
const CommentRepository = require("../repositories/CommentRepository");
const validate = require("../middlewares/validation");
const { commentValidation } = require("../utils/validators");

// Criar comentario
router.post("/", validate(commentValidation), async (req, res, next) => {
  try {
    const comment = await CommentRepository.create(req.body);
    res.status(201).json({
      message: "Comentario criado com sucesso",
      comment: comment,
    });
  } catch (error) {
    next(error);
  }
});

// Buscar comentarios por post
router.get("/post/:postId", async (req, res, next) => {
  try {
    const comments = await CommentRepository.findByPost(req.params.postId);
    res.json({
      message: "Comentarios do post",
      comments: comments,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
