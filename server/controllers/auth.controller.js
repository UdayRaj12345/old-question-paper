const User = require('../models/User');
const { getDB } = require('../config/database');

const sendTokenResponse = (user, statusCode, res) => {
  const token = User.getSignedJwtToken(user);
  const production = process.env.NODE_ENV === 'production';

  return res.status(statusCode)
    .cookie('token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: production ? 'none' : 'lax',
      secure: production
    })
    .json({ success: true, token, data: user });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, college, course, branch, semester } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    if (await User.findByEmail(email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Public registration must never allow a client to self-assign Admin/Faculty roles.
    const user = await User.create({ name, email, password, role: 'Student', college, course, branch, semester });
    return sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(err.code === 'ER_DUP_ENTRY' ? 400 : 500).json({
      success: false,
      message: err.code === 'ER_DUP_ENTRY' ? 'Email already registered' : (err.message === 'Password must be at least 6 characters' || err.message === 'Invalid user role' || err.message === 'Please provide name, email and password' ? err.message : 'Registration failed')
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findByEmail(email, true);
    if (!user || !user.password || !(await User.matchPassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { password: ignored, ...safeUser } = user;
    return sendTokenResponse(safeUser, 200, res);
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Get profile error:', err.message);
    return res.status(500).json({ success: false, message: 'Could not fetch profile' });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const db = getDB();
    const { name, branch, semester, college, course } = req.body;
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (branch !== undefined) { fields.push('branch = ?'); values.push(branch || null); }
    if (semester !== undefined) {
      fields.push('semester = ?');
      values.push(semester === '' || semester === null ? null : Number(semester));
    }
    if (college !== undefined) { fields.push('college = ?'); values.push(college || null); }
    if (course !== undefined) { fields.push('course = ?'); values.push(course || null); }

    if (fields.length) {
      values.push(req.user.id);
      await db.execute(
        `UPDATE users SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Update profile error:', err.message);
    return res.status(500).json({ success: false, message: 'Could not update profile' });
  }
};

exports.logout = async (req, res) => {
  const production = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: production ? 'none' : 'lax',
    secure: production
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
  return res.status(501).json({ success: false, message: 'Password reset is not configured yet' });
};

exports.resetPassword = async (req, res) => {
  return res.status(501).json({ success: false, message: 'Password reset is not configured yet' });
};
