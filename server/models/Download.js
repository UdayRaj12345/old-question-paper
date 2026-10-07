const mongoose = require('mongoose');

const DownloadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null // allow guest downloads
  },
  paper: {
    type: mongoose.Schema.ObjectId,
    ref: 'Paper',
    required: true
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Download', DownloadSchema);
