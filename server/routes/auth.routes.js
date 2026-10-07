const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateDetails);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
