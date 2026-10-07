const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a paper title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  university: {
    // ObjectId stores a relation to the University document, not the university name.
    type: mongoose.Schema.ObjectId,
    ref: 'University'
  },
  college: {
    type: mongoose.Schema.ObjectId,
    ref: 'College'
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department'
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  },
  schoolClass: {
    type: mongoose.Schema.ObjectId,
    ref: 'SchoolClass'
  },
  branch: {
    type: String
  },
  semester: {
    type: Number,
    required: true
  },
  subject: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subject',
    required: true
  },
  subjectCode: {
    type: String
  },
  examType: {
    type: String,
    enum: ['Mid Term', 'End Term', 'Supplementary', 'Unit Test', 'Other', 'Class Test', 'Sessional', 'Mid-Term', 'Final'],
    default: 'End Term'
  },
  academicYear: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2,4}$/, 'Please use YYYY-YY or YYYY-YYYY format']
  },
  examYear: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  duration: {
    type: Number, // in minutes
  },
  maximumMarks: {
    type: Number
  },
  pdfURL: {
    type: String,
    required: [true, 'PDF URL is required']
  },
  originalFileName: {
    type: String
  },
  public_id: {
    type: String
  },
  resource_type: {
    type: String,
    default: 'raw'
  },
  type: {
    type: String,
    default: 'upload'
  },
  thumbnail: {
    type: String
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  uploadedBy: {
    // ObjectId links the paper to the authenticated user who uploaded it.
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for search
PaperSchema.index({
  title: 'text',
  subjectCode: 'text',
  branch: 'text'
});
PaperSchema.index({ subject: 1, academicYear: 1, examType: 1 });
PaperSchema.index({ course: 1, semester: 1 });

module.exports = mongoose.model('Paper', PaperSchema);
