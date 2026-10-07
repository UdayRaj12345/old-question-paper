const mongoose = require('mongoose');

const LibraryBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  class: {
    type: String
  },
  category: {
    type: String
  },
  coverImageURL: {
    type: String
  },
  fileURL: {
    type: String
  },
  publicationYear: {
    type: Number
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LibraryBook', LibraryBookSchema);
