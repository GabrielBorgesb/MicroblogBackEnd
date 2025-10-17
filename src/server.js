// GABRIEL BORGES 2269007
const http = require("http");
const mongoose = require("mongoose");
const url = require("url");
const querystring = require("querystring");

// Models
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// Conexão com MongoDB
mongoose
  .connect("mongodb://localhost:27017/microblogging")
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar MongoDB:", err));

class MicrobloggingAPI {
  constructor() {
    this.server = http.createServer(this.handleRequest.bind(this));
    this.routes = {
      GET: {
        "/health": this.healthCheck.bind(this),
        "/": this.getRoot.bind(this),
        "/users": this.getUsers.bind(this),
        "/users/:id": this.getUserById.bind(this),
        "/posts": this.getPosts.bind(this),
        "/posts/search": this.searchPosts.bind(this),
        "/comments/post/:postId": this.getCommentsByPost.bind(this),
      },
      POST: {
        "/users": this.createUser.bind(this),
        "/posts": this.createPost.bind(this),
        "/posts/:id/like": this.likePost.bind(this),
        "/posts/:id/unlike": this.unlikePost.bind(this),
        "/comments": this.createComment.bind(this),
      },
      DELETE: {
        "/users/:id": this.deleteUser.bind(this),
      },
    };
  }

  async handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Configurar CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    res.setHeader("Content-Type", "application/json");

    try {
      let body = "";

      if (method === "POST" || method === "PUT") {
        body = await this.getRequestBody(req);
      }

      const routeKey = Object.keys(this.routes[method] || {}).find((route) => {
        if (route.includes(":")) {
          const routeParts = route.split("/");
          const pathParts = pathname.split("/");

          if (routeParts.length !== pathParts.length) return false;

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(":")) continue;
            if (routeParts[i] !== pathParts[i]) return false;
          }
          return true;
        }
        return route === pathname;
      });

      if (routeKey) {
        let params = {};
        if (routeKey.includes(":")) {
          const routeParts = routeKey.split("/");
          const pathParts = pathname.split("/");

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(":")) {
              const paramName = routeParts[i].slice(1);
              params[paramName] = pathParts[i];
            }
          }
        }

        const query = parsedUrl.query;
        const data = body ? JSON.parse(body) : {};

        await this.routes[method][routeKey](
          req,
          res,
          { ...params, ...query },
          data
        );
      } else {
        this.sendResponse(res, 404, { error: "Rota não encontrada" });
      }
    } catch (error) {
      console.error("Erro:", error);
      this.sendResponse(res, 500, { error: "Erro interno do servidor" });
    }
  }

  getRequestBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
      req.on("error", reject);
    });
  }

  sendResponse(res, statusCode, data) {
    res.writeHead(statusCode);
    res.end(JSON.stringify(data));
  }

  // Rotas
  async healthCheck(req, res, params, data) {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    this.sendResponse(res, 200, {
      status: "OK",
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  }

  async getRoot(req, res, params, data) {
    this.sendResponse(res, 200, {
      message: "Microblogging API funcionando",
      project: "Projeto 1 - EC48B - Recuperação",
      theme: "Microblogging",
      endpoints: {
        users: "/users",
        posts: "/posts",
        comments: "/comments",
      },
    });
  }

  // User Routes
  async createUser(req, res, params, data) {
    try {
      // Validação simples
      if (!data.username || !data.email || !data.name) {
        return this.sendResponse(res, 400, {
          error: "Username, email e nome são obrigatórios",
        });
      }

      if (data.username.length < 3) {
        return this.sendResponse(res, 400, {
          error: "Username deve ter pelo menos 3 caracteres",
        });
      }

      const user = new User(data);
      await user.save();

      this.sendResponse(res, 201, {
        message: "Usuário criado com sucesso",
        user: user,
      });
    } catch (error) {
      if (error.code === 11000) {
        this.sendResponse(res, 400, { error: "Username ou email já existe" });
      } else {
        this.sendResponse(res, 400, { error: error.message });
      }
    }
  }

  async getUsers(req, res, params, data) {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      this.sendResponse(res, 200, {
        message: "Lista de usuários",
        users: users,
      });
    } catch (error) {
      this.sendResponse(res, 500, { error: error.message });
    }
  }

  async getUserById(req, res, params, data) {
    try {
      const user = await User.findById(params.id);
      if (!user) {
        return this.sendResponse(res, 404, { error: "Usuário não encontrado" });
      }
      this.sendResponse(res, 200, user);
    } catch (error) {
      this.sendResponse(res, 500, { error: error.message });
    }
  }

  async deleteUser(req, res, params, data) {
    try {
      const user = await User.findByIdAndDelete(params.id);
      if (!user) {
        return this.sendResponse(res, 404, { error: "Usuário não encontrado" });
      }
      this.sendResponse(res, 200, { message: "Usuário deletado com sucesso" });
    } catch (error) {
      this.sendResponse(res, 500, { error: error.message });
    }
  }

  // Post Routes
  async createPost(req, res, params, data) {
    try {
      if (!data.content || !data.author) {
        return this.sendResponse(res, 400, {
          error: "Conteúdo e autor são obrigatórios",
        });
      }

      if (data.content.length > 280) {
        return this.sendResponse(res, 400, {
          error: "Post não pode exceder 280 caracteres",
        });
      }

      const post = new Post(data);
      await post.save();
      await post.populate("author", "username name");

      this.sendResponse(res, 201, {
        message: "Post criado com sucesso",
        post: post,
      });
    } catch (error) {
      this.sendResponse(res, 400, { error: error.message });
    }
  }

  async getPosts(req, res, params, data) {
    try {
      const posts = await Post.find()
        .populate("author", "username name")
        .sort({ createdAt: -1 });

      this.sendResponse(res, 200, {
        message: "Lista de posts",
        posts: posts,
      });
    } catch (error) {
      this.sendResponse(res, 500, { error: error.message });
    }
  }

  async searchPosts(req, res, params, data) {
    try {
      const parsedUrl = url.parse(req.url, true);
      const searchTerm = parsedUrl.query.q;

      if (!searchTerm) {
        return this.sendResponse(res, 400, {
          error: "Termo de busca é obrigatório",
        });
      }

      console.log(`Buscando posts por: "${searchTerm}"`); // Para debug

      const posts = await Post.find({
        $or: [
          { content: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
        ],
      })
        .populate("author", "username name")
        .sort({ createdAt: -1 });

      this.sendResponse(res, 200, {
        message: `Posts encontrados para "${searchTerm}"`,
        posts: posts,
      });
    } catch (error) {
      console.error("Erro na busca:", error);
      this.sendResponse(res, 500, { error: error.message });
    }
  }

  async likePost(req, res, params, data) {
    try {
      const { userId } = data;
      if (!userId) {
        return this.sendResponse(res, 400, { error: "userId é obrigatório" });
      }

      const post = await Post.findByIdAndUpdate(
        params.id,
        { $addToSet: { likes: userId } },
        { new: true }
      ).populate("author", "username name");

      if (!post) {
        return this.sendResponse(res, 404, { error: "Post não encontrado" });
      }

      post.likesCount = post.likes.length;
      await post.save();

      this.sendResponse(res, 200, {
        message: "Post curtido",
        post: post,
      });
    } catch (error) {
      this.sendResponse(res, 500, { error: error.message });
    }
  }

  async unlikePost(req, res, params, data) {
    try {
      const { userId } = data;
      if (!userId) {
        return this.sendResponse(res, 400, { error: "userId é obrigatório" });
      }

      const post = await Post.findByIdAndUpdate(
        params.id,
        { $pull: { likes: userId } },
        { new: true }
      ).populate("author", "username name");

      if (!post) {
        return this.sendResponse(res, 404, { error: "Post não encontrado" });
      }

      post.likesCount = post.likes.length;
      await post.save();

      this.sendResponse(res, 200, {
        message: "Post descurtido",
        post: post,
      });
    } catch (error) {
      this.sendResponse(res, 500, { error: error.message });
    }
  }

  // Comment Routes
  async createComment(req, res, params, data) {
    try {
      if (!data.content || !data.author || !data.post) {
        return this.sendResponse(res, 400, {
          error: "Conteúdo, autor e post são obrigatórios",
        });
      }

      if (data.content.length > 280) {
        return this.sendResponse(res, 400, {
          error: "Comentário não pode exceder 280 caracteres",
        });
      }

      const comment = new Comment(data);
      await comment.save();
      await comment.populate("author", "username name");

      this.sendResponse(res, 201, {
        message: "Comentário criado com sucesso",
        comment: comment,
      });
    } catch (error) {
      this.sendResponse(res, 400, { error: error.message });
    }
  }

  async getCommentsByPost(req, res, params, data) {
    try {
      const comments = await Comment.find({ post: params.postId })
        .populate("author", "username name")
        .sort({ createdAt: -1 });

      this.sendResponse(res, 200, {
        message: "Comentários do post",
        comments: comments,
      });
    } catch (error) {
      this.sendResponse(res, 500, { error: error.message });
    }
  }

  start(port = 3000) {
    this.server.listen(port, () => {
      console.log("=========================================");
      console.log("Microblogging API - Projeto 1 EC48B - Recuperação");
      console.log(`Servidor rodando na porta ${port}`);
      console.log(`URL: http://localhost:${port}`);
      console.log(`Health: http://localhost:${port}/health`);
      console.log("Endpoints disponíveis:");
      console.log("   POST /users - Criar usuário");
      console.log("   POST /posts - Criar post");
      console.log("   POST /comments - Criar comentário");
      console.log("   GET /users - Listar usuários");
      console.log("   GET /posts - Listar posts");
      console.log("=========================================");
    });
  }
}

// Iniciar servidor
const api = new MicrobloggingAPI();
api.start(3000);

module.exports = MicrobloggingAPI;
