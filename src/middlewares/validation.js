// GABRIEL BORGES 2269007
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      console.warn("Validação falhou:", error.details[0].message);
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    next();
  };
};

module.exports = validate;
