// GABRIEL BORGES 2269007
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

// Importar rotas
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();

// Middlewares
app.use(express.json());
app.use(
  session({
    secret: "microblogging-secret-2269007",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Conexão com MongoDB
mongoose
  .connect("mongodb://localhost:27017/microblogging")
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar MongoDB:", err));

// Registrar as rotas
app.use("/api/auth", authRoutes);
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
    message: "Microblogging API - Projeto 2 EC48B",
    project: "Projeto 2 - EC48B",
    theme: "Microblogging com Autenticação",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      posts: "/api/posts",
      comments: "/api/comments",
    },
  });
});

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    method: req.method,
    url: req.originalUrl,
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error("Erro capturado:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Erro de validação",
      details: error.message,
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
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log("=========================================");
  console.log("Microblogging API - Projeto 2 EC48B");
  console.log("Recursos: Sessions, Autenticação, MVC");
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log("Endpoints disponíveis:");
  console.log("   POST /api/auth/login - Login");
  console.log("   POST /api/auth/logout - Logout");
  console.log("   POST /api/users - Criar usuário");
  console.log("   POST /api/posts - Criar post (auth)");
  console.log("=========================================");
});

module.exports = app;
