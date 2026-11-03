const express = require('express');
const { reportPaper, getReports, updateReportStatus } = require('../controllers/report.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/:paperId', reportPaper);

// Admin only routes for viewing/updating reports
router.get('/', authorize('Admin'), getReports);
router.put('/:id', authorize('Admin'), updateReportStatus);

module.exports = router;
