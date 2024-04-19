const User = require('../../models/User');
const logger = require('../../utils/logger');

async function isAdmin(req, res, next) {
  if (!req.session.userId) {
    logger.error('Unauthorized: No session available');
    return res.status(401).send('Unauthorized: No session available');
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      logger.error('Unauthorized: User not found');
      return res.status(401).send('Unauthorized: User not found');
    }
    if (user.isAdmin) { // Assuming there's an isAdmin flag in the User model
      next();
    } else {
      logger.error('Forbidden: Requires admin privileges');
      return res.status(403).send('Forbidden: Requires admin privileges');
    }
  } catch (error) {
    logger.error('Server error in isAdmin middleware', error);
    return res.status(500).send('Server error');
  }
}

module.exports = isAdmin;