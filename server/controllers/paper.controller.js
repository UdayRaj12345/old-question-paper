const { getDB } = require('../config/database');
const path = require('path');
const { Readable } = require('stream');
const Paper = require('../models/Paper');
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
exports.getPapers = async (req, res, next) => {
  try {
    const db = getDB();
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;
    const where = ["p.status = 'Approved'"];
    const values = [];
    if (req.query.search) {
      where.push('(p.title LIKE ? OR p.description LIKE ? OR p.subjectCode LIKE ?)');
      const term = `%${String(req.query.search).slice(0, 100)}%`;
      values.push(term, term, term);
    }
    if (req.query.semester && Number.isInteger(Number(req.query.semester))) {
      where.push('p.semester = ?'); values.push(Number(req.query.semester));
    }
    if (req.query.course && Number.isInteger(Number(req.query.course))) {
      where.push('p.course = ?'); values.push(Number(req.query.course));
    }
    const clause = `WHERE ${where.join(' AND ')}`;
    const [countRows] = await db.execute(`SELECT COUNT(*) AS total FROM papers p ${clause}`, values);
    const orderMap = { newest: 'p.createdAt DESC', downloads: 'p.downloads DESC', views: 'p.views DESC', title: 'p.title ASC' };
    const order = orderMap[req.query.sort] || orderMap.newest;
    const [rows] = await db.execute(
      `SELECT p.*, s.name AS subjectName, s.code AS subjectCodeName, c.name AS courseName, u.name AS uploaderName
       FROM papers p LEFT JOIN subjects s ON s.id=p.subject LEFT JOIN courses c ON c.id=p.course
       LEFT JOIN users u ON u.id=p.uploadedBy ${clause} ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );
    const total = Number(countRows[0]?.total || 0);
    res.status(200).json({ success: true, count: rows.length, total, pagination: { page, limit, pages: Math.ceil(total / limit) }, data: rows });
  } catch (err) { next(err); }
};

// @desc    Get single paper
exports.getPaper = async (req, res, next) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid paper ID' });
    const [rows] = await db.execute(
      `SELECT p.*, un.name AS universityName, co.name AS collegeName, d.name AS departmentName,
       c.name AS courseName, s.name AS subjectName, s.code AS subjectCodeName, u.name AS uploaderName, u.avatar AS uploaderAvatar
       FROM papers p LEFT JOIN universities un ON un.id=p.university LEFT JOIN colleges co ON co.id=p.college
       LEFT JOIN departments d ON d.id=p.department LEFT JOIN courses c ON c.id=p.course
       LEFT JOIN subjects s ON s.id=p.subject LEFT JOIN users u ON u.id=p.uploadedBy WHERE p.id=? LIMIT 1`, [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: `No paper found with id ${id}` });
    const paper = await Paper.incrementCounter(id, 'views');
    return res.status(200).json({ success: true, data: { ...rows[0], views: paper.views } });
  } catch (err) { next(err); }
};

// @desc    Download a paper PDF with a proper filename
exports.downloadPaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: `No paper found with id ${req.params.id}` });
    }

    const downloadFileName = sanitizeFileName(
      paper.originalFileName || `${paper.title || 'paper'}.pdf`
    );

    const downloadUrl = buildCloudinaryDownloadUrl(paper, downloadFileName);
    if (!downloadUrl) {
      return res.status(500).json({ success: false, message: 'The paper does not have a valid PDF URL' });
    }

    const response = await fetch(downloadUrl, {
      headers: { Accept: 'application/pdf,application/octet-stream' },
    });

    if (!response.ok) {
      throw new Error(`Cloudinary download failed with status ${response.status}`);
    }

    await Paper.incrementCounter(paper.id, 'downloads');
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
exports.createPaper = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Please log in before uploading a paper.'
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file.'
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed.'
      });
    }

    const universityName = (req.body.universityName || '').trim();
    const courseName = (req.body.courseName || '').trim();
    const subjectName = (req.body.subjectName || '').trim();
    const subjectCode = (req.body.subjectCode || '').trim();
    const semester = Number(req.body.semester);
    const examType = (req.body.examType || '').trim();

    if (!universityName || !courseName || !subjectName ||
        !subjectCode || !Number.isInteger(semester) ||
        semester < 1 || semester > 8 || !examType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a university, course, subject, valid semester, and exam type.'
      });
    }

    const db = getDB();

    const [universities] = await db.execute(
      'SELECT id FROM universities WHERE name = ? AND isActive = 1 LIMIT 1',
      [universityName]
    );

    if (!universities.length) {
      return res.status(400).json({
        success: false,
        message: 'Selected university was not found. Refresh the page and try again.'
      });
    }

    const [courses] = await db.execute(
      'SELECT id FROM courses WHERE name = ? AND isActive = 1 LIMIT 1',
      [courseName]
    );

    if (!courses.length) {
      return res.status(400).json({
        success: false,
        message: 'Selected course was not found. Refresh the page and try again.'
      });
    }

    // Semester match nahi kiya jata: user koi bhi semester chun sakta hai.
    const [subjects] = await db.execute(
      `SELECT id, code, course
       FROM subjects
       WHERE name = ? AND code = ? AND course = ? AND isActive = 1
       LIMIT 1`,
      [subjectName, subjectCode, courses[0].id]
    );

    if (!subjects.length) {
      return res.status(400).json({
        success: false,
        message: 'The selected subject does not match the selected course. Please reselect the subject.'
      });
    }

    const subject = subjects[0];

    const nowYear = new Date().getFullYear();
    const academicYear = `${nowYear}-${nowYear + 1}`;
    const examYear = nowYear;

    const title = `${subjectName} - ${examType} ${examYear}`;
    const originalFileName = sanitizeFileName(req.file.originalname || 'paper.pdf');
    const approved = ['Admin', 'Faculty'].includes(req.user.role);
    const status = approved ? 'Approved' : 'Pending';

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'college_papers',
          resource_type: 'raw',
          type: 'upload',
          access_mode: 'public'
        },
        (error, uploadResult) => {
          if (error) {
            console.error('Cloudinary upload failed:', {
  message: error.message,
  http_code: error.http_code,
  name: error.name,
  details: error.error,
  response: error.response?.body
});
            return reject(error);
          }

          if (!uploadResult || !uploadResult.secure_url) {
            return reject(new Error('Cloudinary did not return a secure PDF URL.'));
          }

          resolve(uploadResult);
        }
      );

      streamifier.createReadStream(req.file.buffer)
        .on('error', reject)
        .pipe(uploadStream);
    });

    const paper = await Paper.create({
      title,
      description: null,
      university: universities[0].id,
      course: courses[0].id,
      subject: subject.id,
      subjectCode: subject.code,
      semester,
      examType,
      academicYear,
      examYear,
      language: 'English',
      pdfURL: result.secure_url,
      originalFileName,
      public_id: result.public_id || null,
      resource_type: result.resource_type || 'raw',
      type: result.type || 'upload',
      uploadedBy: req.user.id,
      approved,
      status
    });

    return res.status(201).json({
      success: true,
      message: 'Paper uploaded successfully',
      data: paper
    });
  } catch (err) {
    console.error('Create paper error:', err.stack || err);
    return next(err);
  }
};

// @desc    Update paper
exports.updatePaper = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid paper ID' });
    const paper = await Paper.findById(id);
    if (!paper) return res.status(404).json({ success: false, message: 'No paper found' });
    if (String(paper.uploadedBy) !== String(req.user.id) && req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'User not authorized to update this paper' });
    const allowed = ['title','description','semester','examType','academicYear','examYear','language','duration','maximumMarks','branch'];
    const fields = []; const values = [];
    for (const key of allowed) if (req.body[key] !== undefined) { fields.push(`\`${key}\` = ?`); values.push(req.body[key] === '' ? null : req.body[key]); }
    if (!fields.length) return res.status(400).json({ success: false, message: 'No editable fields provided' });
    const db = getDB(); values.push(id);
    await db.execute(`UPDATE papers SET ${fields.join(', ')}, updatedAt=CURRENT_TIMESTAMP WHERE id=?`, values);
    return res.status(200).json({ success: true, data: await Paper.findById(id) });
  } catch (err) { next(err); }
};

exports.deletePaper = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid paper ID' });
    const paper = await Paper.findById(id);
    if (!paper) return res.status(404).json({ success: false, message: 'No paper found' });
    if (String(paper.uploadedBy) !== String(req.user.id) && req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'User not authorized' });
    const db = getDB();
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute('DELETE FROM bookmarks WHERE paper=?', [id]);
      await connection.execute('DELETE FROM comments WHERE paper=?', [id]);
      await connection.execute('DELETE FROM ratings WHERE paper=?', [id]);
      await connection.execute('DELETE FROM reports WHERE paper=?', [id]);
      await connection.execute('DELETE FROM papers WHERE id=?', [id]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally { connection.release(); }
    return res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};

exports.searchPapers = async (req, res, next) => {
  try {
    if (!String(req.query.keyword || '').trim()) return res.status(400).json({ success: false, message: 'Please provide a search keyword' });
    req.query.search = req.query.keyword;
    return exports.getPapers(req, res, next);
  } catch (err) { next(err); }
};

exports.getRecentPapers = async (req, res, next) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(`SELECT p.*, s.name AS subjectName, s.code AS subjectCodeName FROM papers p LEFT JOIN subjects s ON s.id=p.subject WHERE p.status='Approved' ORDER BY p.createdAt DESC LIMIT 10`);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(err); }
};

exports.getPopularPapers = async (req, res, next) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(`SELECT p.*, s.name AS subjectName, s.code AS subjectCodeName FROM papers p LEFT JOIN subjects s ON s.id=p.subject WHERE p.status='Approved' ORDER BY p.downloads DESC, p.views DESC LIMIT 10`);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(err); }
};
