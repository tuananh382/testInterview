import Post, { IPost } from "../models/postModel";

export class PostService {
  static async getAllPosts() {
    return await Post.find();
  }

  static async getPostById(id: string) {
    return await Post.findById(id);
  }

  static async createPost(postData: IPost) {
    const post = new Post(postData);
    return await post.save();
  }

  static async updatePost(id: string, postData: Partial<IPost>) {
    return await Post.findByIdAndUpdate(id, postData, { new: true });
  }

  static async deletePost(id: string) {
    return await Post.findByIdAndDelete(id);
  }
}
