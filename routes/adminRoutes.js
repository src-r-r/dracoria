const express = require('express');
const router = express.Router();
const isAdmin = require('./middleware/adminMiddleware');
const User = require('../models/User');
const Dragon = require('../models/Dragon');
const Garden = require('../models/Garden');
const logger = require('../utils/logger');

// Admin dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    const dragons = await Dragon.find({});
    const gardens = await Garden.find({});
    res.render('admin/dashboard', { users, dragons, gardens });
  } catch (error) {
    logger.error('Failed to load admin dashboard: ' + error.message + '\nStack: ' + error.stack);
    res.status(500).send('Server error');
  }
});

// Additional admin routes (e.g., user search, dragon updates, garden modifications) go here

module.exports = router;