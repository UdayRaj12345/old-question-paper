const mongoose = require('mongoose');

const SchoolClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SchoolClass', SchoolClassSchema);
