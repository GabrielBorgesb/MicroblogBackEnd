// GABRIEL BORGES 2269007
const BaseRepository = require("./BaseRepository");
const Comment = require("../models/Comment");

class CommentRepository extends BaseRepository {
  constructor() {
    super(Comment);
  }

  async findByPost(postId) {
    try {
      return await this.model
        .find({ post: postId })
        .populate("author", "username name")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CommentRepository();
