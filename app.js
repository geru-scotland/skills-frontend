/**
 * ==========================================
 * Basics
 * ==========================================
 */
console.log("Aplicación iniciada");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const importData = require('./db/migrate');

/**
 * ==========================================
 * Rutas imports
 * ==========================================
 */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const skillsRouter = require('./routes/skills');
const adminRouter = require('./routes/admin');

/**
 * ==========================================
 * Configuración de app Express
 * ==========================================
 */
const port = process.env.PORT || 3001;
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

/**
 * ==========================================
 * Rutas princpales definición
 * ==========================================
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/skills', skillsRouter);
app.use('/admin', adminRouter);

/**
 * ==========================================
 * MongoDB + migración
 * ==========================================
 */
function dbBootstrap() {
    const promise = new Promise(async (resolve, reject) => {
        try {
            console.log('Conectando a MongoDB...');
            await mongoose.connect('mongodb://localhost:27017/skills-db');
            console.log('Conexión establecida con MongoDB: skills-db');

            console.log('Migrando datos...');
            await importData();
            resolve();
        } catch (error) {
            console.error('Error conectando a MongoDB:', error);
            reject(error);
        }
    });

    return promise;
}

/**
 * ==========================================
 * Server init
 * ==========================================
 */
dbBootstrap()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error iniciando la aplicación:', error);
    });

/**
 * ==========================================
 * Gestión de errores
 * ==========================================
 */
app.use((req, res, next) => {
    const error = new Error("Page not found.");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        error: {
            status: err.status || 500,
            message: err.message || "Internal server error."
        },
    });
});

module.exports = app;
