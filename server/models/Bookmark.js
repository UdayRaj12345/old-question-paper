const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  paper: {
    type: mongoose.Schema.ObjectId,
    ref: 'Paper',
    required: true
  }
}, {
  timestamps: true
});

BookmarkSchema.index({ user: 1, paper: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
