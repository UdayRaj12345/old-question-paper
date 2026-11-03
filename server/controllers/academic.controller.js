
const { getDB } = require('../config/database');

const sendError = (res, error) => {
  console.error('Academic API error:', error.message);

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'This name or code already exists.'
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'The referenced department or course does not exist.'
    });
  }

  return res.status(500).json({
    success: false,
    message: 'An academic data operation failed.'
  });
};

// Universities
exports.listUniversities = async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(
      'SELECT * FROM universities WHERE isActive = 1 ORDER BY name'
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    sendError(res, error);
  }
};

exports.createUniversity = async (req, res) => {
  try {
    const { name, description, location, website, logo } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'University name is required.'
      });
    }

    const db = getDB();
    const [result] = await db.execute(
      `INSERT INTO universities
       (name, description, location, website, logo)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name.trim(),
        description || null,
        location || null,
        website || null,
        logo || 'no-photo.jpg'
      ]
    );

    const [rows] = await db.execute(
      'SELECT * FROM universities WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
};

// Courses
exports.listCourses = async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT c.*, d.name AS departmentName
       FROM courses c
       LEFT JOIN departments d ON d.id = c.department
       WHERE c.isActive = 1
       ORDER BY c.name`
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    sendError(res, error);
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, department, durationYears } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course name is required.'
      });
    }

    const departmentId = department ? Number(department) : null;
    const duration = durationYears == null ? null : Number(durationYears);

    if (departmentId !== null &&
        (!Number.isInteger(departmentId) || departmentId < 1)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID.'
      });
    }

    if (duration !== null &&
        (!Number.isInteger(duration) || duration < 1)) {
      return res.status(400).json({
        success: false,
        message: 'durationYears must be a positive integer.'
      });
    }

    const db = getDB();
    const [result] = await db.execute(
      `INSERT INTO courses (name, department, durationYears)
       VALUES (?, ?, ?)`,
      [name.trim(), departmentId, duration]
    );

    const [rows] = await db.execute(
      'SELECT * FROM courses WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
};

// Subjects
exports.listSubjects = async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT s.*, c.name AS courseName
       FROM subjects s
       INNER JOIN courses c ON c.id = s.course
       WHERE s.isActive = 1 AND c.isActive = 1
       ORDER BY s.course, s.semester, s.name`
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    sendError(res, error);
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, course, semester, credits } = req.body;
    const courseId = Number(course);
    const semesterNumber = Number(semester);
    const creditNumber = credits == null ? null : Number(credits);

    if (!name || !name.trim() || !code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subject name and code are required.'
      });
    }

    if (!Number.isInteger(courseId) || courseId < 1 ||
        !Number.isInteger(semesterNumber) || semesterNumber < 1) {
      return res.status(400).json({
        success: false,
        message: 'A valid course ID and semester are required.'
      });
    }

    if (creditNumber !== null &&
        (!Number.isInteger(creditNumber) || creditNumber < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be a non-negative integer.'
      });
    }

    const db = getDB();
    const [result] = await db.execute(
      `INSERT INTO subjects (name, code, course, semester, credits)
       VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), code.trim(), courseId, semesterNumber, creditNumber]
    );

    const [rows] = await db.execute(
      'SELECT * FROM subjects WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
};
