const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    return res.render('skill-tree');
  }
  return res.redirect('/users/login');
});

module.exports = router;
