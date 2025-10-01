// GABRIEL BORGES 2269007
const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
  logger.error("Erro capturado:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Erro de validação",
      details: error.details,
    });
  }

  if (error.name === "MongoError" && error.code === 11000) {
    return res.status(400).json({
      error: "Dados duplicados",
      details: "Já existe um registro com esses dados",
    });
  }

  res.status(500).json({
    error: "Erro interno do servidor",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Algo deu errado",
  });
};

module.exports = errorHandler;
