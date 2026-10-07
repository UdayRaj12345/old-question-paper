const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Holiday', 'Exam', 'Meeting', 'Other'],
    required: true
  },
  targetAudience: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);
