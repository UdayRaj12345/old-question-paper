const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add college name'],
    trim: true,
    maxlength: [150, 'Name can not be more than 150 characters']
  },
  university: {
    type: mongoose.Schema.ObjectId,
    ref: 'University',
    required: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true
  },
  location: {
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

// Ensure a college name is unique within a university
CollegeSchema.index({ name: 1, university: 1 }, { unique: true });

// Reverse populate with virtuals
CollegeSchema.virtual('departments', {
  ref: 'Department',
  localField: '_id',
  foreignField: 'college',
  justOne: false
});

module.exports = mongoose.model('College', CollegeSchema);
