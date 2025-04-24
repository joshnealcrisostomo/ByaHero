const express = require('express');
const router = express.Router();
const {updateReport, deleteReport} = require('../model/crudReport.js'); 
router.post('/admin/report/:id/approve', async (req, res) => {
    try {
        const reportId = req.params.id;
        const updateResult = await updateReport(reportId, { status: 'Resolved' });

        if (updateResult.success) {
            res.redirect('/admin');
        } else {
            res.status(500).send('Failed to approve report.');
        }
    } catch (error) {
        console.error('Error approving report:', error);
        res.status(500).send('Server error');
    }
});

// Delete Report Route
router.post('/admin/report/:id/delete', async (req, res) => {
    try {
        const reportId = req.params.id;
        const deleteResult = await deleteReport(reportId);

        if (deleteResult.success) {
            res.redirect('/admin');
        } else {
            res.status(500).send('Failed to delete report.');
        }
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).send('Server error');
    }
});

// Approve Comment Report Route
router.post('/admin/comment-report/:id/approve', async (req, res) => {
    try {
        const reportId = req.params.id;
        const updateResult = await updateReport(reportId, { status: 'Resolved' });

        if (updateResult.success) {
            res.redirect('/admin');
        } else {
            res.status(500).send('Failed to approve comment report.');
        }
    } catch (error) {
        console.error('Error approving comment report:', error);
        res.status(500).send('Server error');
    }
});

// Delete Comment Report Route
router.post('/admin/comment-report/:id/delete', async (req, res) => {
    try {
        const reportId = req.params.id;
        const deleteResult = await deleteReport(reportId);

        if (deleteResult.success) {
            res.redirect('/admin');
        } else {
            res.status(500).send('Failed to delete comment report.');
        }
    } catch (error) {
        console.error('Error deleting comment report:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;