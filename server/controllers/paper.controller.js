const path = require('path');
const { Readable } = require('stream');
const Paper = require('../models/Paper');
const University = require('../models/University');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const sanitizeFileName = (fileName) => {
  const parsed = path.parse(fileName || 'paper.pdf');
  const baseName = (parsed.name || 'paper').replace(/[\\/:*?"<>|]/g, '_').trim();
  const ext = parsed.ext ? parsed.ext.toLowerCase() : '.pdf';
  return `${baseName}${ext}`;
};

const buildCloudinaryDownloadUrl = (paper, downloadFileName) => {
  if (!paper?.pdfURL) {
    return null;
  }

  const separator = paper.pdfURL.includes('?') ? '&' : '?';
  const encodedName = encodeURIComponent(downloadFileName);
  return `${paper.pdfURL}${separator}fl_attachment=${encodedName}`;
};

// @desc    Get all papers
// @route   GET /api/papers
// @access  Public
exports.getPapers = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single paper
// @route   GET /api/papers/:id
// @access  Public
exports.getPaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate('university college department course subject uploadedBy', 'name code avatar');

    if (!paper) {
      return res.status(404).json({ success: false, message: `No paper found with id ${req.params.id}` });
    }

    // Increment views
    paper.views += 1;
    await paper.save();

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Download a paper PDF with a proper filename
// @route   GET /api/papers/:id/download
// @access  Public
exports.downloadPaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: `No paper found with id ${req.params.id}` });
    }

    const downloadFileName = sanitizeFileName(
      paper.originalFileName || `${paper.title || 'paper'}.pdf`
    );

    paper.downloads = (paper.downloads || 0) + 1;
    await paper.save();

    const downloadUrl = buildCloudinaryDownloadUrl(paper, downloadFileName);
    if (!downloadUrl) {
      return res.status(500).json({ success: false, message: 'The paper does not have a valid PDF URL' });
    }

    const response = await fetch(downloadUrl, {
      headers: {
        Accept: 'application/pdf,application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`Cloudinary download failed with status ${response.status}`);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFileName}"`);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body);
      nodeStream.pipe(res);
      return;
    }

    res.status(500).json({ success: false, message: 'No PDF stream returned from storage' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Failed to download PDF' });
  }
};

// @desc    Upload new paper
// @route   POST /api/papers
// @access  Private
exports.createPaper = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.uploadedBy = req.user.id;

    // Auto approve if Admin or Faculty
    if (req.user.role === 'Admin' || req.user.role === 'Faculty') {
      req.body.approved = true;
      req.body.status = 'Approved';
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    req.body.originalFileName = sanitizeFileName(req.file.originalname || 'paper.pdf');

    // Process string relationships to ObjectIds
    if (req.body.universityName) {
      let uni = await University.findOne({ name: { $regex: new RegExp(`^${req.body.universityName}$`, 'i') } });
      if (!uni) uni = await University.create({ name: req.body.universityName, code: req.body.universityName.substring(0, 3).toUpperCase() });
      req.body.university = uni._id;
    }

    if (req.body.courseName) {
      let course = await Course.findOne({ name: { $regex: new RegExp(`^${req.body.courseName}$`, 'i') } });
      if (!course) course = await Course.create({ name: req.body.courseName, code: req.body.courseName.substring(0, 3).toUpperCase() });
      req.body.course = course._id;
    }

    if (req.body.subjectName) {
      let subject = await Subject.findOne({ name: { $regex: new RegExp(`^${req.body.subjectName}$`, 'i') } });
      if (!subject) {
        subject = await Subject.create({
          name: req.body.subjectName,
          code: req.body.subjectCode || 'SUB',
          course: req.body.course,
          semester: req.body.semester || 1
        });
      }
      req.body.subject = subject._id;
    }

    req.body.examYear = req.body.academicYear ? parseInt(req.body.academicYear.substring(0, 4)) : new Date().getFullYear();
    req.body.title = `${req.body.subjectName || 'Unknown Subject'} - ${req.body.examType || 'Exam'} ${req.body.examYear}`;

    // Upload to cloudinary using stream
    const resourceType = req.file?.mimetype === 'application/pdf' ? 'raw' : 'auto';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'college_papers',
        resource_type: resourceType,
        type: 'upload',
        access_mode: 'public',
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, message: error.message || 'Cloudinary upload failed' });
        }

        console.log('Cloudinary upload result:', result);

        if (!result?.secure_url) {
          return res.status(500).json({ success: false, message: 'Cloudinary upload did not return a secure URL' });
        }

        req.body.pdfURL = result.secure_url;
        req.body.public_id = result.public_id;
        req.body.resource_type = result.resource_type || resourceType;
        req.body.type = result.type || 'upload';

        const paper = await Paper.create(req.body);

        res.status(201).json({
          success: true,
          message: 'Paper uploaded successfully',
          data: paper
        });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (err) {
    next(err);
  }
};

// @desc    Update paper
// @route   PUT /api/papers/:id
// @access  Private (Admin or Uploader)
exports.updatePaper = async (req, res, next) => {
  try {
    let paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: `No paper found` });
    }

    // Make sure user is paper owner or admin
    if (paper.uploadedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: `User not authorized to update this paper` });
    }

    paper = await Paper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: paper });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete paper
// @route   DELETE /api/papers/:id
// @access  Private (Admin or Uploader)
exports.deletePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: `No paper found` });
    }

    if (paper.uploadedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: `User not authorized` });
    }

    await paper.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Search papers (text search)
// @route   GET /api/papers/search?keyword=...
// @access  Public
exports.searchPapers = async (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.status(400).json({ success: false, message: 'Please provide a search keyword' });
    }

    // We can use res.advancedResults in routes, or implement basic search here.
    // Assuming advancedResults is used in the route.
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get recent papers
// @route   GET /api/papers/recent
// @access  Public
exports.getRecentPapers = async (req, res, next) => {
  try {
    const papers = await Paper.find({ status: 'Approved' })
      .sort('-createdAt')
      .limit(10)
      .populate('subject', 'name code');
    res.status(200).json({ success: true, count: papers.length, data: papers });
  } catch (err) {
    next(err);
  }
};

// @desc    Get popular papers
// @route   GET /api/papers/popular
// @access  Public
exports.getPopularPapers = async (req, res, next) => {
  try {
    const papers = await Paper.find({ status: 'Approved' })
      .sort('-downloads')
      .limit(10)
      .populate('subject', 'name code');
    res.status(200).json({ success: true, count: papers.length, data: papers });
  } catch (err) {
    next(err);
  }
};
