
const { getDB } = require('../config/database');

const Bookmark = {
  async findByUser(userId) {
    const db = getDB();

    const [rows] = await db.execute(
      `SELECT
         b.id,
         b.\`user\`,
         b.paper,
         b.createdAt,
         b.updatedAt,
         p.*
       FROM bookmarks b
       INNER JOIN papers p ON p.id = b.paper
       WHERE b.\`user\` = ?
       ORDER BY b.createdAt DESC`,
      [userId]
    );

    return rows;
  },

  async findOne({ user, paper }) {
    const db = getDB();

    const [rows] = await db.execute(
      'SELECT * FROM bookmarks WHERE `user` = ? AND paper = ? LIMIT 1',
      [user, paper]
    );

    return rows[0] || null;
  },

  async create({ user, paper }) {
    const db = getDB();

    const [result] = await db.execute(
      'INSERT INTO bookmarks (`user`, paper) VALUES (?, ?)',
      [user, paper]
    );

    const [rows] = await db.execute(
      'SELECT * FROM bookmarks WHERE id = ? LIMIT 1',
      [result.insertId]
    );

    return rows[0] || null;
  },

  async remove({ user, paper }) {
    const db = getDB();

    const [result] = await db.execute(
      'DELETE FROM bookmarks WHERE `user` = ? AND paper = ?',
      [user, paper]
    );

    return result.affectedRows > 0;
  }
};

module.exports = Bookmark;
