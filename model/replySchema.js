const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    edited: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Reply', replySchema);