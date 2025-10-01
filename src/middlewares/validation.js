// GABRIEL BORGES 2269007
const logger = require("../utils/logger");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      logger.warn("Validação falhou:", {
        error: error.details[0].message,
        body: req.body,
      });

      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    next();
  };
};

module.exports = validate;
