const Reply = require("./replySchema");
const { ObjectId } = require("mongodb");
const Comment = require("./commentSchema");

async function addReply(commentId, username, content) {
    try {
        if (!commentId || !username || !content) {
            console.log(" Missing required fields!", { commentId, username, content });
            return { error: "Missing required fields" };
        }

        content = String(content).trim();

        const newReply = new Reply({ commentId, username, content });
        const savedReply = await newReply.save();

        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $push: { replies: savedReply._id } }, 
            { new: true }
        ).populate("replies");

        if (!comment) {
            console.log(" Comment not found when updating!");
            return { error: "Comment not found" };
        }

        return savedReply;
    } catch (error) {
        console.error(" Error adding reply:", error);
        return { error: error.message };
    }
}

async function getReplies(commentId) {
    console.log("🟢 Replies is being fetched"); //debugging
    try {
        const comment = await Comment.findById(commentId)
            .populate({
                path: "replies",
                options: { sort: { createdAt: -1 } }
            })
            .exec();

            console.log("🟢 Replies Fetched:", comment?.replies); //debugging

        if (!comment) {
            console.log(" Comment not found!");
            return [];
        }

        return comment.replies;
    } catch (error) {
        console.error(" Error fetching replies:", error);
        return { error: error.message };
    }
}

async function deleteReply(replyId) {
    try {
        const reply = await Reply.findByIdAndDelete(replyId);
        if (!reply) {
            console.log(" Reply not found!");
            return { success: false, message: "Reply not found" };
        }

        await Comment.updateMany({}, { $pull: { replies: replyId } });

        return { success: true, message: "Reply deleted successfully" };
    } catch (error) {
        console.error(" Error deleting reply:", error);
        return { success: false, message: error.message };
    }
}

async function updateReply(replyId, content) {
    try {
        if (!ObjectId.isValid(replyId)) {
            console.log("ReplyId is not a valid ObjectId: ", replyId);
            throw new Error('Invalid reply ID format');
        }

        const reply = await Reply.findById(replyId);

        if (!reply) {
            throw new Error('Reply not found');
        }

        reply.content = content;
        reply.updatedAt = Date.now();
        reply.edited = true;

        await reply.save();

        console.log('Reply updated successfully!');
        return { success: true, message: 'Reply updated successfully', reply };
    } catch (error) {
        console.error('Error in updateReply:', error);
        return { success: false, message: error.message || 'Internal server error' };
    }
}

module.exports = { addReply, getReplies, deleteReply, updateReply };