const express = require('express');
const { ratePaper } = require('../controllers/rating.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/:paperId', protect, ratePaper);

module.exports = router;
