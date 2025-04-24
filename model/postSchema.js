const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true,
    },
    postContent: {
        type: String,
        required: true,
    },
    postImage: {
        type: String,
        default: '',
    },
    votes: {
        type: Number,
        default: 0,
    },
    tags: {
        type: String,
        default: '',
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    edited: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);