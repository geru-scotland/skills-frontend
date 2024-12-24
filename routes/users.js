const express = require('express');
const User = require('../models/User'); // Importar modelo de usuario
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', function(req, res) {
  console.log("Accediendo a la ruta /login");
  res.render('login'); // Renderiza el archivo login.ejs
});

// Ruta para procesar el login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send('Usuario no encontrado');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Contraseña incorrecta');
  }

  // Generar el token JWT
  const token = jwt.sign({ userId: user._id, role: user.role }, 'tu_clave_secreta', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
