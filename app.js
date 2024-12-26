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
const session = require('express-session');
const importData = require('./db/migrate');

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
        await importData();
        console.log('Datos iniciales importados');
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
