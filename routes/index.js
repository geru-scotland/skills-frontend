/**
 * ==========================================
 * Imports y config inicial
 * ==========================================
 */
const express = require('express');
const router = express.Router();

/**
 * ==========================================
 * Endpoints: root
 * ==========================================
 */
router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    return res.redirect('/skills');
  }
  return res.redirect('/users/login');
});

/**
 * ==========================================
 * Endpoints: about
 * ==========================================
 */
router.get('/about', function(req, res) {
  res.render('about');
});

/**
 * ==========================================
 * Exports
 * ==========================================
 */
module.exports = router;