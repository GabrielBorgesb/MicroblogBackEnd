// GABRIEL BORGES 2269007
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const net = require("net");
const logger = require("./utils/logger");

// Importar rotas
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose
  .connect("mongodb://localhost:27017/microblogging")
  .then(() => logger.info("Conectado ao MongoDB"))
  .catch((err) => logger.error("Erro ao conectar MongoDB:", err));

// Registrar as rotas
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Rota de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Rota principal
app.get("/", (req, res) => {
  res.json({
    message: "Microblogging API funcionando",
    project: "Projeto 1 - EC48B",
    theme: "Microblogging",
    endpoints: {
      users: "/api/users",
      posts: "/api/posts",
      comments: "/api/comments",
    },
  });
});

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Rota nao encontrada",
    method: req.method,
    url: req.originalUrl,
  });
});

// Função para encontrar porta livre
function findFreePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const tester = net
      .createServer()
      .once("error", (err) => {
        if (err.code === "EADDRINUSE") {
          resolve(findFreePort(startPort + 1));
        } else {
          reject(err);
        }
      })
      .once("listening", () => {
        tester.once("close", () => resolve(startPort)).close();
      })
      .listen(startPort);
  });
}

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  logger.error("Erro capturado:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Erro de validacao",
      details: error.message,
    });
  }

  res.status(500).json({
    error: "Erro interno do servidor",
  });
});

// Iniciar servidor
async function startServer() {
  try {
    const port = await findFreePort(3000);

    app.listen(port, () => {
      logger.info(`Servidor iniciado na porta ${port}`);
      console.log("=========================================");
      console.log("Microblogging API - Projeto 1 EC48B");
      console.log(`URL: http://localhost:${port}`);
      console.log(`Health: http://localhost:${port}/health`);
      console.log("Endpoints disponiveis:");
      console.log("   POST /api/users - Criar usuario");
      console.log("   POST /api/posts - Criar post");
      console.log("   POST /api/comments - Criar comentario");
      console.log("   GET /api/users - Listar usuarios");
      console.log("   GET /api/posts - Listar posts");
      console.log("=========================================");
    });
  } catch (error) {
    logger.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
