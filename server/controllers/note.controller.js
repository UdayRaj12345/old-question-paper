const { getDB } = require('../config/database');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadToCloudinary = (buffer) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream({ folder: 'college_notes', resource_type: 'auto', type: 'upload', access_mode: 'public' }, (err, result) => {
    if (err) return reject(err);
    if (!result?.secure_url) return reject(new Error('Cloudinary did not return a file URL'));
    resolve(result);
  });
  streamifier.createReadStream(buffer).on('error', reject).pipe(stream);
});

exports.getNotes = async (req, res, next) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(`SELECT n.*, s.name AS subjectName, sc.name AS schoolClassName, u.name AS uploaderName FROM notes n LEFT JOIN subjects s ON s.id=n.subject LEFT JOIN school_classes sc ON sc.id=n.schoolClass LEFT JOIN users u ON u.id=n.uploadedBy ORDER BY n.createdAt DESC`);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(err); }
};

exports.getNote = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid note ID' });
    const db = getDB();
    const [rows] = await db.execute(`SELECT n.*, s.name AS subjectName, sc.name AS schoolClassName, u.name AS uploaderName FROM notes n LEFT JOIN subjects s ON s.id=n.subject LEFT JOIN school_classes sc ON sc.id=n.schoolClass LEFT JOIN users u ON u.id=n.uploadedBy WHERE n.id=? LIMIT 1`, [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Note not found' });
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.createNote = async (req, res, next) => {
  try {
    if (!req.file?.buffer) return res.status(400).json({ success: false, message: 'Please upload a file' });
    const title = String(req.body.title || '').trim();
    const topic = String(req.body.topic || '').trim();
    const subject = Number(req.body.subject);
    const schoolClass = Number(req.body.schoolClass);
    if (!title || !topic || !Number.isSafeInteger(subject) || subject <= 0 || !Number.isSafeInteger(schoolClass) || schoolClass <= 0) {
      return res.status(400).json({ success: false, message: 'Title, topic, valid subject and school class are required' });
    }
    const uploaded = await uploadToCloudinary(req.file.buffer);
    const db = getDB();
    const [result] = await db.execute('INSERT INTO notes (title, subject, schoolClass, topic, description, fileURL, uploadedBy) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, subject, schoolClass, topic, req.body.description || null, uploaded.secure_url, req.user.id]);
    const [rows] = await db.execute('SELECT * FROM notes WHERE id=?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Note created successfully', data: rows[0] });
  } catch (err) { next(err); }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid note ID' });
    const db = getDB();
    const [rows] = await db.execute('SELECT id, uploadedBy FROM notes WHERE id=?', [id]);
    const note = rows[0];
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (String(note.uploadedBy) !== String(req.user.id) && req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'Not authorized to delete this note' });
    await db.execute('DELETE FROM notes WHERE id=?', [id]);
    return res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};
