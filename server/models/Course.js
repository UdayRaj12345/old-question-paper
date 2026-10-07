const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add course name (e.g., B.Tech, MCA)'],
    trim: true
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department'
  },
  durationYears: {
    type: Number
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

CourseSchema.index({ name: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('Course', CourseSchema);
