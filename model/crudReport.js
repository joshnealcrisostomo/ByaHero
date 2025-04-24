require('dotenv').config();

const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");
const Report = require('./reportSchema.js'); 
const User = require('./UserSchema'); 
const Post = require('./postSchema'); 
const Comment = require('./commentSchema');
const {deleteComment} = require('./crudComments')
const {deletePost} = require('./crudPost')
const uri = process.env.MONGODB_URI;

mongoose.connect(uri);

async function createReport(reportedItemId, reportedItemType, authorId, reason, details) {
  try {
    if (!ObjectId.isValid(reportedItemId) || !ObjectId.isValid(authorId)) {
      console.log("Invalid ObjectId format");
      throw new Error('Invalid ID format');
    }

    if (!['Post', 'Comment'].includes(reportedItemType)) {
      throw new Error('Invalid reportedItemType. Must be either Post or Comment');
    }

    let reportedItem;
    if (reportedItemType === 'Post') {
      reportedItem = await Post.findById(reportedItemId);
    } else {
      reportedItem = await Comment.findById(reportedItemId);
    }

    if (!reportedItem) {
      throw new Error(`${reportedItemType} not found`);
    }

    const author = await User.findById(authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    const newReport = new Report({
      reportedItemId,
      reportedItemType,
      author: authorId,
      reason,
      details: details || '',
      status: 'Pending'
    });

    await newReport.save();

    console.log('✅ Report created successfully!');
    return { success: true, message: 'Report created successfully', report: newReport };
  } catch (error) {
    if (error.code === 11000) {
      console.error('❌ Duplicate report:', error);
      return { success: false, message: 'This item has already been reported' };
    }
    
    console.error('❌ Error in createReport:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
}

async function getReportById(reportId) {
  try {
    if (!ObjectId.isValid(reportId)) {
      return { success: false, message: "Invalid Report ID format" };
    }

    const report = await Report.findById(reportId)
      .populate('author', 'username email');
    
    if (!report) {
      return { success: false, message: "Report not found" };
    }

    return { success: true, report };
  } catch (error) {
    console.error("❌ Error retrieving report:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

async function getAllReports(filters = {}) {
  try {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.reportedItemType) {
      query.reportedItemType = filters.reportedItemType;
    }
    
    if (filters.authorId && ObjectId.isValid(filters.authorId)) {
      query.author = filters.authorId;
    }
    
    const reports = await Report.find(query)
      .populate('author', 'username email')
      .populate({
        path: 'reportedItemId',
        refPath: 'reportedItemType'  // This will use the reportedItemType value to determine which model to use
      })
      .sort({ createdAt: -1 });
    
    return { success: true, reports };
  } catch (error) {
    console.error("❌ Error retrieving reports:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

async function updateReport(reportId, updateData) {
  try {
      if (!ObjectId.isValid(reportId)) {
          return { success: false, message: "Invalid Report ID format" };
      }

      const report = await Report.findById(reportId).populate('reportedItemId');

      if (!report) {
          return { success: false, message: "Report not found" };
      }

      if (report.reportedItemType === 'Post') {
          await deletePost(report.reportedItemId._id);
      } else if (report.reportedItemType === 'Comment') {
          await deleteComment(report.reportedItemId._id);
      }

      const updatedReport = await Report.findByIdAndUpdate(
          reportId,
          { $set: updateData },
          { new: true }
      );

      console.log("✅ Report updated successfully:", updatedReport);
      return {
          success: true,
          message: "Report updated successfully",
          report: updatedReport
      };
  } catch (error) {
      console.error("❌ Error updating report:", error);
      return { success: false, message: error.message || "Server error" };
  }
}
async function deleteReport(reportId) {
  try {
    if (!ObjectId.isValid(reportId)) {
      return { success: false, message: "Invalid Report ID format" };
    }

    const reportExists = await Report.findById(reportId);
    if (!reportExists) {
      console.error("❌ Report not found.");
      return { success: false, message: "Report not found in database" };
    }

    console.log("🔍 Found report, proceeding with deletion:", reportExists);

    const deleteResult = await Report.deleteOne({ _id: reportId });

    if (deleteResult.deletedCount === 0) {
      console.error("❌ Report deletion failed:", reportId);
      return { success: false, message: "Report could not be deleted" };
    }

    console.log("✅ Report deleted successfully:", reportId);
    return { success: true, message: "Report deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting report:", error);
    return { success: false, message: "Server error" };
  }
}

module.exports = { createReport, getReportById, getAllReports, updateReport, deleteReport };