var express = require('express');
var router = express.Router();

// Redirigir a /login cuando se accede a la raíz
router.get('/', function(req, res, next) {
  res.redirect('/login'); // Redirige a /login
});

module.exports = router;
