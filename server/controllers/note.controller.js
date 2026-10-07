const Note = require('../models/Note');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find().populate('subject schoolClass uploadedBy', 'name');
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).populate('subject schoolClass uploadedBy', 'name');
    if (!note) {
      return res.status(404).json({ success: false, message: `No note found with id ${req.params.id}` });
    }
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload new note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    if (req.user) {
      req.body.uploadedBy = req.user.id;
    }

    const resourceType = 'auto';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'college_notes',
        resource_type: resourceType,
        type: 'upload',
        access_mode: 'public',
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, message: error.message || 'Cloudinary upload failed' });
        }

        if (!result?.secure_url) {
          return res.status(500).json({ success: false, message: 'Cloudinary upload did not return a secure URL' });
        }

        req.body.fileURL = result.secure_url;

        const note = await Note.create(req.body);

        res.status(201).json({
          success: true,
          message: 'Note created successfully',
          data: note
        });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (err) {
    next(err);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: `No note found` });
    }

    // Ensure only the owner or an admin can delete the note
    if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: `User not authorized to delete this note` });
    }

    await note.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
