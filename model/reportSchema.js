const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    reportedItemId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    reportedItemType: {
        type: String,
        enum: ['Post', 'Comment', 'User'],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    details: {
        type: String,
        default: ''
    }
});

ReportSchema.index({ reportedItemId: 1, reportedItemType: 1, reason: 1 }, { unique: true });

module.exports = mongoose.model('Report', ReportSchema);