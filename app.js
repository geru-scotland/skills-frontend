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

// ***************************************
// Rutas imports
// ***************************************
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

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


// ***************************************
// MongoDB
// ***************************************
mongoose.connect('mongodb://localhost:27017/tu_basededatos')
    .then(async () => {
      console.log('Conectado a MongoDB');
      const userCount = await User.countDocuments();

      // Si no hay usuarios, registrar al primero como 'admin'
      if (userCount === 0) {
        const admin = new User({
          username: 'admin',
          password: 'admin123',
          role: 'admin',
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
// Server init
// ***************************************
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
