const { check } = require('express-validator');

exports.paperValidator = [
  check('title', 'Title is required').notEmpty(),
  check('university', 'University ID is required').notEmpty(),
  check('course', 'Course ID is required').notEmpty(),
  check('semester', 'Semester is required').isNumeric(),
  check('subject', 'Subject ID is required').notEmpty(),
  check('academicYear', 'Academic year is required (YYYY-YY format)').matches(/^\d{4}-\d{2}$/),
  check('examYear', 'Exam year is required').isNumeric()
];
