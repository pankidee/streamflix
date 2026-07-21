const User = require('../models/User');

module.exports = async function adminMiddleware(req, res, next) {
  try {
    const user = await User.findByPk(req.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};