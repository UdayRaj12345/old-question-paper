
const express = require('express');
const {
  listUniversities,
  createUniversity,
  listCourses,
  createCourse,
  listSubjects,
  createSubject
} = require('../controllers/academic.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Public read access
router.get('/universities', listUniversities);
router.get('/courses', listCourses);
router.get('/subjects', listSubjects);

// Admin-only write access
router.post('/universities', protect, authorize('Admin'), createUniversity);
router.post('/courses', protect, authorize('Admin'), createCourse);
router.post('/subjects', protect, authorize('Admin'), createSubject);

module.exports = router;
