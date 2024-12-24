const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', function(req, res) {
  console.log("Accediendo a la ruta /login");
  res.render('login');
});

// Ruta para mostrar el formulario de registro
router.get('/register', function(req, res) {
  res.render('register'); 
});

// Ruta para  el login
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

// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;

  // Validar que todos los campos estén completos
  if (!username || !password || !password2) {
    return res.render('register', { error: 'Todos los campos son obligatorios.' });
  }

  // Validar que las contraseñas coincidan
  if (password !== password2) {
    return res.render('register', { error: 'Las contraseñas no coinciden.' });
  }

  // Validar que las contraseñas tengan al menos 6 caracteres
  if (password.length < 6) {
    return res.render('register', { error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  // Verificar si el nombre de usuario ya está registrado
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render('register', { error: 'El nombre de usuario ya está en uso.' });
  }

  // Si es el primer usuario, asignarle el rol de admin
  const role = (await User.countDocuments()) === 0 ? 'admin' : 'user';

  // Crear un nuevo usuario
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
module.exports = router;
