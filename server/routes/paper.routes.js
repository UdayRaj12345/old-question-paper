const express = require('express');
const {
  getPapers,
  getPaper,
  downloadPaper,
  createPaper,
  updatePaper,
  deletePaper,
  searchPapers,
  getRecentPapers,
  getPopularPapers
} = require('../controllers/paper.controller');

const Paper = require('../models/Paper');
const advancedResults = require('../utils/advancedResults');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { paperValidator } = require('../validators/paper.validator');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

// Public routes
router.get('/search', advancedResults(Paper, 'university college department course subject'), searchPapers);
router.get('/recent', getRecentPapers);
router.get('/popular', getPopularPapers);
router.get('/', advancedResults(Paper, 'university college department course subject'), getPapers);
router.get('/:id/download', downloadPaper);
router.get('/:id', getPaper);

// Protected routes
router.post(
  '/',
  protect,
  upload.single('pdf'),
  // paperValidator, validateRequest, // (Optional: ensure frontend sends multipart form data properly before validating)
  createPaper
);

router.put('/:id', protect, updatePaper);
router.delete('/:id', protect, deletePaper);

module.exports = router;
