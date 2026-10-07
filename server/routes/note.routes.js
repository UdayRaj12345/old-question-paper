const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  deleteNote
} = require('../controllers/note.controller');

const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', protect, upload.single('file'), createNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;
