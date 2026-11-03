
const Bookmark = require('../models/Bookmark');
const Paper = require('../models/Paper');

// @desc    Get user bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findByUser(req.user.id);

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a bookmark
// @route   POST /api/bookmarks/:paperId
// @access  Private
exports.addBookmark = async (req, res, next) => {
  try {
    const paperId = Number(req.params.paperId);

    if (!Number.isSafeInteger(paperId) || paperId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid paper ID'
      });
    }

    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    const existing = await Bookmark.findOne({
      user: req.user.id,
      paper: paperId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Paper already bookmarked'
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user.id,
      paper: paperId
    });

    res.status(201).json({
      success: true,
      data: bookmark
    });
  } catch (err) {
    // MySQL duplicate-key error (concurrent requests)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Paper already bookmarked'
      });
    }

    next(err);
  }
};

// @desc    Remove a bookmark
// @route   DELETE /api/bookmarks/:paperId
// @access  Private
exports.removeBookmark = async (req, res, next) => {
  try {
    const paperId = Number(req.params.paperId);

    if (!Number.isSafeInteger(paperId) || paperId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid paper ID'
      });
    }

    const removed = await Bookmark.remove({
      user: req.user.id,
      paper: paperId
    });

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
