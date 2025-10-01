// GABRIEL BORGES 2269007
const BaseRepository = require("./BaseRepository");
const User = require("../models/User");

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByUsername(username) {
    try {
      return await this.model.findOne({ username });
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
