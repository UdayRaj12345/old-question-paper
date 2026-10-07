const express = require('express');
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBookmarks);

router.route('/:paperId')
  .post(addBookmark)
  .delete(removeBookmark);

module.exports = router;
