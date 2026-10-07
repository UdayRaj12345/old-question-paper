const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
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
  reason: {
    type: String,
    enum: ['Wrong Paper', 'Duplicate Paper', 'Spam', 'Broken PDF', 'Other'],
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);
