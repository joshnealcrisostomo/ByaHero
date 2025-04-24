require('dotenv').config();

const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");
const Post = require('./postSchema'); 
const User = require('./UserSchema');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri);

async function createPost(postTitle, postContent, postImage, tags, userId) {
  try {
    if(!ObjectId.isValid(userId)){
      console.log("UserId is not a valid ObjectId : ", userId);
      throw new Error('Invalid user ID format');
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newPost = new Post({
      postTitle,
      postContent,
      postImage: postImage || '',
      votes: 0, 
      tags: tags || '', 
      comments: [], 
      author: user._id, 
    });

    await newPost.save();

    console.log('Post created successfully!');
    return { success: true, message: 'Post created successfully', post: newPost };
  } catch (error) {
    console.error('Error in createPost:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
}

async function deletePost(postId) {
  try {
    if (!ObjectId.isValid(postId)) {
      return { success: false, message: "Invalid Post ID format" };
    }
    
    const result = await Post.findByIdAndDelete(postId);
    
    if (!result) {
      return { success: false, message: "Post not found" };
    }
    
    console.log("✅ Post deleted successfully");
    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

async function updatePost(postId, postTitle, postContent, tags, userId) {
  try {
    if (!ObjectId.isValid(postId)) {
      console.log("PostId is not a valid ObjectId: ", postId);
      throw new Error('Invalid post ID format');
    }
    
    if (!ObjectId.isValid(userId)) {
      console.log("UserId is not a valid ObjectId: ", userId);
      throw new Error('Invalid user ID format');
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    if (post.author.toString() !== userId.toString()) {
      throw new Error('Not authorized to edit this post');
    }
    
    post.postTitle = postTitle;
    post.postContent = postContent;
    post.tags = tags;
    post.updatedAt = Date.now();
    post.edited = true;
    
    await post.save();
    
    console.log('Post updated successfully!');
    return { success: true, message: 'Post updated successfully', post };
  } catch (error) {
    console.error('Error in updatePost:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
}

async function getPostById(postId) {
  try {
    if (!ObjectId.isValid(postId)) {
      return { success: false, message: "Invalid Post ID format" };
    }

    const post = await Post.findById(postId).populate('author', 'username email');
    
    if (!post) {
      return { success: false, message: "Post not found" };
    }

    return { success: true, post };
  } catch (error) {
    console.error("❌ Error retrieving post:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

module.exports = { createPost, deletePost, updatePost, getPostById };