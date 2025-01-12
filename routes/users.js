/**
 * ==========================================
 * Imports y config inicial
 * ==========================================
 */
const express = require('express');
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/auth');
const { loginUser, registerUser } = require('../services/authService');
const Badge = require('../models/Badge');
const router = express.Router();

/**
 * ==========================================
 * Endpoints: login
 * ==========================================
 */
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userSessionData = await loginUser(username, password);

    req.session.user = userSessionData;
    return res.redirect('/skills');
  } catch (error) {
    console.error(error.message);
    return res.status(400).render('login', { error: error.message });
  }
});

/**
 * ==========================================
 * Endpoints: register
 * ==========================================
 */
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;

  try {
    const userSessionData = await registerUser(username, password, password2);

    req.session.user = userSessionData;
    return res.redirect('/skills');
  } catch (error) {
    console.error(error.message);
    return res.status(400).render('register', { error: error.message });
  }
});

/**
 * ==========================================
 * Endpoints: dashboard
 * ==========================================
 */
router.get('/dashboard', isAuthenticated, function(req, res) {
  res.render('dashboard', { user: req.session.user });
});

/**
 * ==========================================
 * Endpoints: logout
 * ==========================================
 */
router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error cerrando la sesión:', err);
      return res.status(500).render('error', { error: 'Error cerrando la sesión' });
    }
    res.render('login', { message: 'Sesión cerrada exitosamente' });
  });
});

/**
 * ==========================================
 * Endpoints: leaderboard
 * ==========================================
 */
router.get('/leaderboard', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find();
    const badges = await Badge.find();

    users.forEach(user => {
      const badge = badges
          .filter(b => user.score >= b.bitpoints_min && user.score <= b.bitpoints_max)
          .sort((a, b) => b.bitpoints_max - a.bitpoints_max)[0];
      user.badge = badge ? badge.name : 'No badge';
      console.log(user.username, user.score, badge);
    });

    const groupedUsers = badges.reduce((acc, badge) => {
      const usersWithBadge = users.filter(user => user.badge === badge.name);
      if (usersWithBadge.length > 0) {
        acc[badge.name] = usersWithBadge;
      }
      return acc;
    }, {});

    const sortedBadges = badges.sort((a, b) => b.bitpoints_max - a.bitpoints_max);

    res.render('leaderboard', { groupedUsers, sortedBadges });
  } catch (error) {
    console.error('Error recalculando la clasificación:', error);
  }
});

/**
 * ==========================================
 * Exports
 * ==========================================
 */
module.exports = router;
