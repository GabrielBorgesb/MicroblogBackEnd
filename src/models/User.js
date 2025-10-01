// GABRIEL BORGES 2269007
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username é obrigatório"],
    unique: true,
    trim: true,
    minlength: [3, "Username deve ter pelo menos 3 caracteres"],
    maxlength: [30, "Username não pode exceder 30 caracteres"],
  },
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, "Nome é obrigatório"],
    trim: true,
    maxlength: [100, "Nome não pode exceder 100 caracteres"],
  },
  bio: {
    type: String,
    maxlength: [500, "Bio não pode exceder 500 caracteres"],
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
