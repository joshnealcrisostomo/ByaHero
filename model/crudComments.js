const Comment = require("./commentSchema");
const { ObjectId } = require("mongodb");
const Post = require("./postSchema");

async function addComment(postId, username, content) {
    try {
        if (!postId || !username || !content) {
            console.log("❌ Missing required fields!", { postId, username, content });
            return { error: "Missing required fields" };
        }

        content = String(content).trim();

        const newComment = new Comment({ postId, username, content });
        const savedComment = await newComment.save();

        const post = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: savedComment._id } }, 
            { new: true }
        ).populate("comments");

        if (!post) {
            console.log("❌ Post not found when updating!");
            return { error: "Post not found" };
        }

        return savedComment;
    } catch (error) {
        console.error("❌ Error adding comment:", error);
        return { error: error.message };
    }
}

async function getComments(postId) {
    try {
        const post = await Post.findById(postId)
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } }
            })
            .exec();

        if (!post) {
            console.log("❌ Post not found!");
            return [];
        }

        return post.comments;
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        return { error: error.message };
    }
}

async function deleteComment(commentId) {
    try {
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            console.log("❌ Comment not found!");
            return { success: false, message: "Comment not found" };
        }

        await Post.updateMany({}, { $pull: { comments: commentId } });

        return { success: true, message: "Comment deleted successfully" };
    } catch (error) {
        console.error("❌ Error deleting comment:", error);
        return { success: false, message: error.message };
    }
}

async function updateComment(commentId, content) {
    try {
        if (!ObjectId.isValid(commentId)) {
            console.log("CommentId is not a valid ObjectId: ", commentId);
            throw new Error('Invalid comment ID format');
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new Error('Comment not found');
        }

        comment.content = content;
        comment.updatedAt = Date.now();
        comment.edited = true;

        await comment.save();

        console.log('Comment updated successfully!');
        return { success: true, message: 'Comment updated successfully', comment };
    } catch (error) {
        console.error('Error in updateComment:', error);
        return { success: false, message: error.message || 'Internal server error' };
    }
}

module.exports = { addComment, getComments, deleteComment, updateComment };