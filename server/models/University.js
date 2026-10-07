const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add university name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  location: {
    type: String
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  logo: {
    type: String,
    default: 'no-photo.jpg'
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

// Cascade delete colleges when a university is deleted
UniversitySchema.pre('remove', async function(next) {
  console.log(`Colleges being removed from university ${this._id}`);
  await this.model('College').deleteMany({ university: this._id });
  next();
});

// Reverse populate with virtuals
UniversitySchema.virtual('colleges', {
  ref: 'College',
  localField: '_id',
  foreignField: 'university',
  justOne: false
});

module.exports = mongoose.model('University', UniversitySchema);
