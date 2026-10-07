const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add some text'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  paper: {
    type: mongoose.Schema.ObjectId,
    ref: 'Paper',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);
