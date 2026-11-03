const { getDB } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = {
  async findByEmail(email, includePassword = false) {
    const db = getDB();
    const columns = includePassword
      ? '*'
      : 'id, name, email, role, avatar, college, course, branch, semester, isVerified, createdAt, updatedAt';

    const [rows] = await db.execute(
      `SELECT ${columns} FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT id, name, email, role, avatar, college, course, branch, semester, isVerified, createdAt, updatedAt FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const db = getDB();
    const {
      name, email, password,
      role = 'Student',
      college = null,
      course = null,
      branch = null,
      semester = null
    } = data;

    if (!name || !email || !password) {
      throw new Error('Please provide name, email and password');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const roles = ['Guest', 'Student', 'Faculty', 'Admin', 'Parent', 'Staff'];
    if (!roles.includes(role)) {
      throw new Error('Invalid user role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, role, college, course, branch, semester)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, college || null, course || null, branch || null, semester ?? null]
    );

    return this.findById(result.insertId);
  },

  async matchPassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  },

  getSignedJwtToken(user) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
  }
};

module.exports = User;
