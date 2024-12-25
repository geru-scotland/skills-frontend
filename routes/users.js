const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ***************************************
// GET
// ***************************************
router.get('/login', function(req, res) {
  console.log("Accediendo a la ruta /login");
  res.render('login');
});

router.get('/register', function(req, res) {
  res.render('register');
});

// ***************************************
// POST
// ***************************************
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

  const token = jwt.sign({ userId: user._id, role: user.role }, 'tu_clave_secreta', { expiresIn: '1h' });
  res.json({ token });
});

router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;

  if (!username || !password || !password2) {
    return res.render('register', { error: 'Todos los campos son obligatorios.' });
  }

  if (password !== password2) {
    return res.render('register', { error: 'Las contraseñas no coinciden.' });
  }

  if (password.length < 6) {
    return res.render('register', { error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render('register', { error: 'El nombre de usuario ya está en uso.' });
  }

  const role = (await User.countDocuments()) === 0 ? 'admin' : 'user';

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
    role,
  });

  try {
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.render('register', { error: 'Error al registrar el usuario. Intenta de nuevo.' });
  }
});

// ***************************************
// Exports
// ***************************************
module.exports = router;
