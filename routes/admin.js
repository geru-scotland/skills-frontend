const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');
const Badge = require('../models/Badge');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/dashboard', isAdmin, (req, res) => {
    res.render('admin-dashboard', { username: req.session.user.username });
});

router.get('/badges', isAdmin, async (req, res) => {
    const badges = await Badge.find().sort({ bitpoints_min: 1 });
    res.render('admin-badges', { badges });
});

router.get('/badges/edit/:id', isAdmin, async (req, res) => {
    const badge = await Badge.findById(req.params.id);
    if (!badge) return res.status(404).render('error', { error: 'Insignia no encontrada' });
    res.render('edit-badge', { badge });
});

router.post('/badges/edit/:id', isAdmin, async (req, res) => {
    try {
        const { name, bitpoints_min, bitpoints_max, image_url } = req.body;
        await Badge.findByIdAndUpdate(req.params.id, {
            name,
            bitpoints_min,
            bitpoints_max,
            image_url
        });
        res.redirect('/admin/badges');
    } catch (error) {
        res.status(500).render('error', { error: 'Error actualizando la insignia' });
    }
});

router.post('/badges/delete/:id', isAdmin, async (req, res) => {
    try {
        await Badge.findByIdAndDelete(req.params.id);
        res.redirect('/admin/badges');
    } catch (error) {
        res.status(500).render('error', { error: 'Error borrando la insignia' });
    }
});

router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, 'username admin');
        res.render('admin-users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo los usuarios');
    }
});

router.post('/change-password', isAdmin, async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({ success: true });
    } catch (error) {
        console.error('Error cambiando la contraseña:', error);
        res.status(500).json({ error: 'Error cambiando la contraseña' });
    }
});

module.exports = router;
