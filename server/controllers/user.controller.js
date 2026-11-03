const User = require('../models/User');
const { getDB } = require('../config/database');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'avatar', 'college', 'course', 'branch', 'semester'];
    const fields = []; const values = [];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        fields.push(`\`${key}\` = ?`);
        values.push(req.body[key] === '' ? null : req.body[key]);
      }
    }
    if (!fields.length) return res.status(400).json({ success: false, message: 'No profile fields provided' });
    const db = getDB(); values.push(req.user.id);
    await db.execute(`UPDATE users SET ${fields.join(', ')}, updatedAt=CURRENT_TIMESTAMP WHERE id=?`, values);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};
