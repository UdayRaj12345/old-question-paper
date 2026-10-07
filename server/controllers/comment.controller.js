const Comment = require('../models/Comment');
const Paper = require('../models/Paper');

// @desc    Get comments for a paper
// @route   GET /api/comments/:paperId
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ paper: req.params.paperId, parentComment: null })
      .populate('user', 'name avatar')
      .sort('-createdAt');
      
    // Nested comments handling can be done by fetching all and grouping in frontend
    // or by another query. For simplicity, we just fetch root comments here.
    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    next(err);
  }
};

// @desc    Add comment
// @route   POST /api/comments/:paperId
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    req.body.paper = req.params.paperId;
    req.body.user = req.user.id;

    const paper = await Paper.findById(req.params.paperId);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    const comment = await Comment.create(req.body);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this comment' });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, { text: req.body.text }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await comment.remove();
    // Also remove child comments
    await Comment.deleteMany({ parentComment: req.params.id });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
