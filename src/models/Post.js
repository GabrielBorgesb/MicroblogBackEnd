// GABRIEL BORGES 2269007
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Conteúdo é obrigatório"],
    trim: true,
    maxlength: [280, "Post não pode exceder 280 caracteres"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Autor é obrigatório"],
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likesCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.pre("save", function (next) {
  this.likesCount = this.likes.length;
  next();
});

module.exports = mongoose.model("Post", postSchema);
