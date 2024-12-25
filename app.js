// ***************************************
// Basics
// ***************************************
console.log("Aplicación iniciada");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/User');
const session = require('express-session');
const fs = require('fs')
const Badge = require('./models/Badge');

// ***************************************
// Rutas imports
// ***************************************
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const skillsRouter = require('./routes/skills');
const adminRouter = require('./routes/admin');

// ***************************************
// Config app Express
// ***************************************
const app = express();

app.use(session({
    secret: 'orbit...',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ***************************************
// Rutas
// ***************************************
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/skills', skillsRouter);
app.use('/admin', adminRouter);

// ***************************************
// MongoDB
// ***************************************
mongoose.connect('mongodb://localhost:27017/skills-db')
    .then(async () => {
      console.log('Conectado a MongoDB');
      const userCount = await User.countDocuments();

      // Si no hay usuarios, registrar al primero como 'admin'
      if (userCount === 0) {
        const admin = new User({
          username: 'admin',
          password: 'admin123',
          admin: true,
        });
        await admin.save();
        console.log('Primer usuario registrado como admin');
      }
    })
    .catch(err => {
      console.error('Error al conectar con MongoDB:', err);
    });

// ***************************************
// Error handling
// ***************************************
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// ***************************************
// Scripts
// ***************************************

const loadBadges = async () => {
  try {
    const badgesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/data', 'badges.json')));

    for (const badge of badgesData) {
      // Verifica si el badge ya existe por su nombre
      const existingBadge = await Badge.findOne({ name: badge.rango });

      if (!existingBadge) {
        // Si no existe, crea una nueva badge
        const newBadge = new Badge({
          name: badge.rango,
          bitpoints_min: badge.bitpoints_min,
          bitpoints_max: badge.bitpoints_max,
          image_url: badge.png,
          description: badge.descripcion
        });

        await newBadge.save();
        console.log(`Badge '${newBadge.name}' agregada a la base de datos.`);
      } else {
        console.log(`Badge '${badge.rango}' ya existe, no se agregó nuevamente.`);
      }
    }
  } catch (error) {
    console.error('Error cargando las badges:', error);
  }
};

loadBadges();


// ***************************************
// Server init
// ***************************************
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
