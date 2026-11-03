const { getDB } = require('../config/database');
const Paper = require('../models/Paper');
const validReasons = ['Wrong Paper', 'Duplicate Paper', 'Spam', 'Broken PDF', 'Other'];

exports.reportPaper = async (req, res, next) => {
  try {
    const paperId = Number(req.params.paperId);
    const reason = String(req.body.reason || '');
    const description = String(req.body.description || '').trim();
    if (!Number.isSafeInteger(paperId) || paperId <= 0) return res.status(400).json({ success: false, message: 'Invalid paper ID' });
    if (!validReasons.includes(reason)) return res.status(400).json({ success: false, message: 'Invalid report reason' });
    if (description.length > 500) return res.status(400).json({ success: false, message: 'Description cannot exceed 500 characters' });
    if (!(await Paper.findById(paperId))) return res.status(404).json({ success: false, message: 'Paper not found' });
    const db = getDB();
    const [result] = await db.execute('INSERT INTO reports (`user`, paper, reason, description) VALUES (?, ?, ?, ?)', [req.user.id, paperId, reason, description || null]);
    const [rows] = await db.execute('SELECT * FROM reports WHERE id=?', [result.insertId]);
    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.getReports = async (req, res, next) => {
  try {
    const db = getDB();
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;
    const [rows] = await db.execute('SELECT r.*, u.name AS userName, p.title AS paperTitle FROM reports r LEFT JOIN users u ON u.id=r.user LEFT JOIN papers p ON p.id=r.paper ORDER BY r.createdAt DESC LIMIT ? OFFSET ?', [limit, offset]);
    const [[count]] = await db.execute('SELECT COUNT(*) AS total FROM reports');
    return res.status(200).json({ success: true, count: rows.length, total: Number(count.total), data: rows });
  } catch (err) { next(err); }
};

exports.updateReportStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body.status || '');
    if (!Number.isSafeInteger(id) || id <= 0 || !['Pending', 'Reviewed', 'Resolved'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid report ID or status' });
    const db = getDB();
    const [result] = await db.execute('UPDATE reports SET status=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', [status, id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Report not found' });
    const [rows] = await db.execute('SELECT * FROM reports WHERE id=?', [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};
