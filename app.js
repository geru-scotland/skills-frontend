console.log("Aplicación iniciada");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/User');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Conectar a MongoDB y verificar si hay un usuario registrado
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

app.get('/', (req, res) => {
  console.log("Accediendo a la raíz, redirigiendo a /login");
  res.render('/login');
});

// Ruta para login
app.get('/login', (req, res) => {
  res.render('login');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
