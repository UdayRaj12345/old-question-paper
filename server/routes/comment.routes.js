const express = require('express');
const { getComments, addComment, updateComment, deleteComment } = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/:paperId')
  .get(getComments)
  .post(protect, addComment);

router.route('/item/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
