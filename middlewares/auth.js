
// ***************************************
// Middlewares
// ***************************************

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }
    return res.redirect('/users/login');
}

function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.admin) {
        return next();
    }
    return res.status(403).render('error', { error: 'Acceso denegado. Se requieren permisos de administrador.' });
}

module.exports = {
    isAuthenticated,
    isAdmin
};

