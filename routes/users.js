const express = require('express');
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/auth');
const { loginUser, registerUser } = require('../services/authService');
const router = express.Router();


// ***************************************
// GET
// ***************************************
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/dashboard', isAuthenticated, function(req, res) {
  res.render('dashboard', { user: req.session.user });
});

// ***************************************
// POST
// ***************************************
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userSessionData = await loginUser(username, password);

    req.session.user = userSessionData;
    return res.render('skill-tree');
  } catch (error) {
    console.error(error.message);
    return res.status(400).render('login', { error: error.message });
  }
});

router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;

  try {
    const userSessionData = await registerUser(username, password, password2);

    req.session.user = userSessionData;
    return res.render('skill-tree');
  } catch (error) {
    console.error(error.message);
    return res.status(400).render('register', { error: error.message });
  }
});


// ***************************************
// Exports
// ***************************************
module.exports = router;
