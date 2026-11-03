const { getDB } = require('../config/database');
const Paper = require('../models/Paper');

exports.getComments = async (req, res, next) => {
  try {
    const paperId = Number(req.params.paperId);
    if (!Number.isSafeInteger(paperId) || paperId <= 0) return res.status(400).json({ success: false, message: 'Invalid paper ID' });
    const db = getDB();
    const [rows] = await db.execute(`SELECT c.*, u.name AS userName, u.avatar AS userAvatar FROM comments c LEFT JOIN users u ON u.id=c.user WHERE c.paper=? ORDER BY c.createdAt DESC`, [paperId]);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(err); }
};

exports.addComment = async (req, res, next) => {
  try {
    const paperId = Number(req.params.paperId);
    const text = String(req.body.text || '').trim();
    const parentComment = req.body.parentComment ? Number(req.body.parentComment) : null;
    if (!Number.isSafeInteger(paperId) || paperId <= 0) return res.status(400).json({ success: false, message: 'Invalid paper ID' });
    if (!text || text.length > 2000) return res.status(400).json({ success: false, message: 'Comment must be between 1 and 2000 characters' });
    if (!(await Paper.findById(paperId))) return res.status(404).json({ success: false, message: 'Paper not found' });
    const db = getDB();
    if (parentComment) {
      const [parents] = await db.execute('SELECT id FROM comments WHERE id=? AND paper=?', [parentComment, paperId]);
      if (!parents.length) return res.status(400).json({ success: false, message: 'Parent comment not found for this paper' });
    }
    const [result] = await db.execute('INSERT INTO comments (paper, `user`, parentComment, text) VALUES (?, ?, ?, ?)', [paperId, req.user.id, parentComment, text]);
    const [rows] = await db.execute('SELECT c.*, u.name AS userName, u.avatar AS userAvatar FROM comments c LEFT JOIN users u ON u.id=c.user WHERE c.id=?', [result.insertId]);
    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.updateComment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const text = String(req.body.text || '').trim();
    if (!Number.isSafeInteger(id) || id <= 0 || !text || text.length > 2000) return res.status(400).json({ success: false, message: 'Invalid comment ID or text' });
    const db = getDB();
    const [rows] = await db.execute('SELECT * FROM comments WHERE id=?', [id]);
    const comment = rows[0];
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (String(comment.user) !== String(req.user.id) && req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'Not authorized to update this comment' });
    await db.execute('UPDATE comments SET text=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', [text, id]);
    const [updated] = await db.execute('SELECT * FROM comments WHERE id=?', [id]);
    return res.status(200).json({ success: true, data: updated[0] });
  } catch (err) { next(err); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid comment ID' });
    const db = getDB();
    const [rows] = await db.execute('SELECT * FROM comments WHERE id=?', [id]);
    const comment = rows[0];
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (String(comment.user) !== String(req.user.id) && req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    await db.execute('DELETE FROM comments WHERE id=? OR parentComment=?', [id, id]);
    return res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};
