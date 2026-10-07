const Bookmark = require('../models/Bookmark');
const Paper = require('../models/Paper');

// @desc    Get user bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate('paper')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a bookmark
// @route   POST /api/bookmarks/:paperId
// @access  Private
exports.addBookmark = async (req, res, next) => {
  try {
    const paperId = req.params.paperId;

    // Check if paper exists
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({ user: req.user.id, paper: paperId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Paper already bookmarked' });
    }

    const bookmark = await Bookmark.create({
      user: req.user.id,
      paper: paperId
    });

    res.status(201).json({ success: true, data: bookmark });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove a bookmark
// @route   DELETE /api/bookmarks/:paperId
// @access  Private
exports.removeBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({ user: req.user.id, paper: req.params.paperId });
    
    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    await bookmark.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
