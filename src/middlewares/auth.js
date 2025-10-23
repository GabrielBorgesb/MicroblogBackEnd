// GABRIEL BORGES 2269007
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Não autorizado",
      message: "Você precisa estar logado para acessar este recurso",
    });
  }
  next();
};

module.exports = authMiddleware;
