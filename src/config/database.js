// GABRIEL BORGES 2269007
const mongoose = require("mongoose");
const logger = require("../utils/logger");

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect("mongodb://localhost:27017/microblogging", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info("Conectado ao MongoDB com sucesso");
    } catch (error) {
      logger.error("Erro ao conectar com MongoDB:", error);
      process.exit(1);
    }
  }
}

module.exports = new Database();
