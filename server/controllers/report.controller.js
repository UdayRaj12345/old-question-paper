const Report = require('../models/Report');
const Paper = require('../models/Paper');

// @desc    Report a paper
// @route   POST /api/reports/:paperId
// @access  Private
exports.reportPaper = async (req, res, next) => {
  try {
    const { reason, description } = req.body;
    const paperId = req.params.paperId;

    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    const report = await Report.create({
      user: req.user.id,
      paper: paperId,
      reason,
      description
    });

    res.status(201).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (Admin)
exports.getReports = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private (Admin)
exports.updateReportStatus = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    }, { new: true, runValidators: true });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};
