
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

const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/', getPapers);
router.get('/search', searchPapers);
router.get('/recent', getRecentPapers);
router.get('/popular', getPopularPapers);

router.get('/:id/download', downloadPaper);
router.get('/:id', getPaper);

router.post('/', protect, upload.single('file'), createPaper);
router.put('/:id', protect, updatePaper);
router.delete('/:id', protect, deletePaper);

module.exports = router;
