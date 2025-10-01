// GABRIEL BORGES 2269007
const logger = require("../utils/logger");

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const item = new this.model(data);
      return await item.save();
    } catch (error) {
      logger.error(`Erro ao criar ${this.model.modelName}:`, error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      logger.error(`Erro ao buscar ${this.model.modelName} por ID:`, error);
      throw error;
    }
  }

  async find(filter = {}) {
    try {
      return await this.model.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      logger.error(`Erro ao buscar ${this.model.modelName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error(`Erro ao atualizar ${this.model.modelName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Erro ao deletar ${this.model.modelName}:`, error);
      throw error;
    }
  }
}

module.exports = BaseRepository;
