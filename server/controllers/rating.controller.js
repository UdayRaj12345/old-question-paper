const { getDB } = require('../config/database');
const Paper = require('../models/Paper');

exports.ratePaper = async (req, res, next) => {
  try {
    const paperId = Number(req.params.paperId);
    const rating = Number(req.body.rating);
    if (!Number.isSafeInteger(paperId) || paperId <= 0 || !Number.isFinite(rating) || rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Provide a valid paper ID and rating between 1 and 5' });
    if (!(await Paper.findById(paperId))) return res.status(404).json({ success: false, message: 'Paper not found' });
    const db = getDB();
    await db.execute('INSERT INTO ratings (paper, `user`, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating=VALUES(rating), updatedAt=CURRENT_TIMESTAMP', [paperId, req.user.id, rating]);
    await db.execute('UPDATE papers SET rating=(SELECT COALESCE(AVG(rating),0) FROM ratings WHERE paper=?) WHERE id=?', [paperId, paperId]);
    const [rows] = await db.execute('SELECT * FROM ratings WHERE paper=? AND `user`=? LIMIT 1', [paperId, req.user.id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};
