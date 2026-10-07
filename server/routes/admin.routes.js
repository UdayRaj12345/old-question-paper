const express = require('express');
const { getAnalytics, updatePaperStatus } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/analytics', getAnalytics);
router.put('/papers/:id/status', updatePaperStatus);

module.exports = router;
