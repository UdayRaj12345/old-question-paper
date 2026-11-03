const { getDB } = require('../config/database');

exports.getAnalytics = async (req, res, next) => {
  try {
    const db = getDB();
    const [[users]] = await db.execute('SELECT COUNT(*) AS totalUsers FROM users');
    const [[papers]] = await db.execute('SELECT COUNT(*) AS totalPapers FROM papers');
    const [[downloads]] = await db.execute('SELECT COALESCE(SUM(downloads),0) AS totalDownloads FROM papers');
    const [mostDownloaded] = await db.execute("SELECT id, title, downloads, views FROM papers WHERE status='Approved' ORDER BY downloads DESC LIMIT 5");
    const [monthlyUploads] = await db.execute("SELECT MONTH(createdAt) AS _id, COUNT(*) AS count FROM papers WHERE YEAR(createdAt)=YEAR(CURRENT_DATE()) GROUP BY MONTH(createdAt) ORDER BY _id");
    return res.status(200).json({ success: true, data: { totalUsers: Number(users.totalUsers), totalPapers: Number(papers.totalPapers), totalDownloads: Number(downloads.totalDownloads), mostDownloaded, monthlyUploads } });
  } catch (err) { next(err); }
};

exports.updatePaperStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid paper ID' });
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const db = getDB();
    const [result] = await db.execute('UPDATE papers SET status=?, approved=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', [status, status === 'Approved', id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Paper not found' });
    const [rows] = await db.execute('SELECT * FROM papers WHERE id=?', [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};
