// GABRIEL BORGES 2269007
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Conteúdo é obrigatório"],
    trim: true,
    maxlength: [280, "Comentário não pode exceder 280 caracteres"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Autor é obrigatório"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post é obrigatório"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
