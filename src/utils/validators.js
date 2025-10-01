// GABRIEL BORGES 2269007
const Joi = require("joi");

const userValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
  bio: Joi.string().max(500).optional(),
});

const postValidation = Joi.object({
  content: Joi.string().min(1).max(280).required(),
  author: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
});

const commentValidation = Joi.object({
  content: Joi.string().min(1).max(280).required(),
  author: Joi.string().required(),
  post: Joi.string().required(),
});

module.exports = {
  userValidation,
  postValidation,
  commentValidation,
};
