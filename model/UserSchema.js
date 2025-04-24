const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: 'No bio yet.',
    trim: true,
  },
  profilePic: {
    type: String,
    trim: true,
  },
  headerPic: {
    type: String,
    trim: true,
  },
  upvotedPosts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' 
  }],
  upvotedComments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;