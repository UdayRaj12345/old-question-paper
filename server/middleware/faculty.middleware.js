exports.facultyOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'Faculty' || req.user.role === 'Admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Faculty/Admin resources access denied'
    });
  }
};
