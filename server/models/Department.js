const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add department name'],
    trim: true
  },
  college: {
    type: mongoose.Schema.ObjectId,
    ref: 'College',
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

DepartmentSchema.index({ name: 1, college: 1 }, { unique: true });

module.exports = mongoose.model('Department', DepartmentSchema);
