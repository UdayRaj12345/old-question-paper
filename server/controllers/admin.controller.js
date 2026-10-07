const User = require('../models/User');
const Paper = require('../models/Paper');
const Download = require('../models/Download');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPapers = await Paper.countDocuments();
    const totalDownloads = await Download.countDocuments();

    const mostDownloaded = await Paper.find({ status: 'Approved' })
      .sort('-downloads')
      .limit(5)
      .select('title downloads views');

    // Aggregate monthly uploads
    const monthlyUploads = await Paper.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPapers,
        totalDownloads,
        mostDownloaded,
        monthlyUploads
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve/Reject Paper
// @route   PUT /api/admin/papers/:id/status
// @access  Private (Admin)
exports.updatePaperStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const paper = await Paper.findByIdAndUpdate(req.params.id, {
      status,
      approved: status === 'Approved'
    }, { new: true });

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    res.status(200).json({ success: true, data: paper });
  } catch (err) {
    next(err);
  }
};

// Manage users and other entities can use standard CRUD via advancedResults.
// Those will be defined in their respective routes using the advancedResults middleware and basic controllers.
