const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
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
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one rating per paper
RatingSchema.index({ paper: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
RatingSchema.statics.getAverageRating = async function(paperId) {
  const obj = await this.aggregate([
    {
      $match: { paper: paperId }
    },
    {
      $group: {
        _id: '$paper',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Paper').findByIdAndUpdate(paperId, {
      rating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
RatingSchema.post('save', function() {
  this.constructor.getAverageRating(this.paper);
});

// Call getAverageRating before remove
RatingSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.paper);
});

module.exports = mongoose.model('Rating', RatingSchema);
