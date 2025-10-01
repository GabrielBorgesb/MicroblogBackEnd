// GABRIEL BORGES 2269007
const BaseRepository = require("./BaseRepository");
const Post = require("../models/Post");

class PostRepository extends BaseRepository {
  constructor() {
    super(Post);
  }

  async findWithAuthor() {
    try {
      return await this.model
        .find()
        .populate("author", "username name")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async searchPosts(searchTerm) {
    try {
      return await this.model
        .find({
          content: { $regex: searchTerm, $options: "i" },
        })
        .populate("author", "username name")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async likePost(postId, userId) {
    try {
      const post = await this.model
        .findByIdAndUpdate(
          postId,
          {
            $addToSet: { likes: userId },
          },
          { new: true }
        )
        .populate("author", "username name");

      if (!post) {
        throw new Error("Post não encontrado");
      }

      // Atualiza o likesCount manualmente
      post.likesCount = post.likes.length;
      await post.save();

      return post;
    } catch (error) {
      throw error;
    }
  }

  async unlikePost(postId, userId) {
    try {
      const post = await this.model
        .findByIdAndUpdate(
          postId,
          {
            $pull: { likes: userId },
          },
          { new: true }
        )
        .populate("author", "username name");

      if (!post) {
        throw new Error("Post não encontrado");
      }

      // Atualiza o likesCount manualmente
      post.likesCount = post.likes.length;
      await post.save();

      return post;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PostRepository();
