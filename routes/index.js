var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Skills / Sistemas Web (2024-2025)' });
});

module.exports = router;
