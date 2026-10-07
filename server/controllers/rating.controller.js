const Rating = require('../models/Rating');
const Paper = require('../models/Paper');

// @desc    Add or update rating
// @route   POST /api/ratings/:paperId
// @access  Private
exports.ratePaper = async (req, res, next) => {
  try {
    const paperId = req.params.paperId;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a valid rating between 1 and 5' });
    }

    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    let existingRating = await Rating.findOne({ paper: paperId, user: req.user.id });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      res.status(200).json({ success: true, data: existingRating });
    } else {
      const newRating = await Rating.create({
        paper: paperId,
        user: req.user.id,
        rating
      });
      res.status(201).json({ success: true, data: newRating });
    }
  } catch (err) {
    next(err);
  }
};
