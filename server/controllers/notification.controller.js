const { getDB } = require('../config/database');

exports.getNotifications = async (req, res, next) => {
  try {
    const db = getDB();
    const [rows] = await db.execute('SELECT * FROM notifications WHERE `user`=? ORDER BY createdAt DESC LIMIT 20', [req.user.id]);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(err); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    const db = getDB();
    const [result] = await db.execute('UPDATE notifications SET isRead=1, updatedAt=CURRENT_TIMESTAMP WHERE id=? AND `user`=?', [id, req.user.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Notification not found' });
    const [rows] = await db.execute('SELECT * FROM notifications WHERE id=?', [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};
