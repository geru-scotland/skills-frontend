const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');

router.get('/', isAuthenticated, (req, res) => {
    res.redirect('/skills/electronics');
});

router.get('/:skillTreeName', isAuthenticated, async (req, res) => {
    console.log(req.params.skillTreeName);
    const skills = await Skill.find({ set: req.params.skillTreeName });
    const completedSkills = req.user?.completedSkills || [];
    const admin = req.session.user.admin;
    res.render('index', {
        skillTreeName: req.params.skillTreeName,
        skills,
        completedSkills,
        username: req.session.user.username,
        isAdmin: admin
    });
});

router.get('/:skillTreeName/add', isAdmin, (req, res) => {
    res.render('add-skill', { skillTreeName: req.params.skillTreeName });
});

router.get('/:skillTreeName/all', isAuthenticated, async (req, res) => {
    try {
        const { skillTreeName } = req.params;

        // Encuentra las habilidades asociadas con el árbol solicitado
        const skills = await Skill.find({ set: skillTreeName });

        // Verifica si se encontraron habilidades
        if (!skills || skills.length === 0) {
            return res.status(404).json({ error: 'No skills found for the specified skill tree.' });
        }

        res.json(skills); // Devuelve las habilidades en formato JSON
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:skillTreeName/add', isAdmin, async (req, res) => {
    try {
        const { text, description, tasks, resources, score, icon } = req.body;
        const newSkill = new Skill({
            id: `${req.params.skillTreeName}_${text.replace(/\s+/g, '_').toLowerCase()}`,
            text,
            description,
            tasks: tasks.split('\n'),
            resources: resources.split('\n').map((r) => ({ name: r, url: r })),
            score: parseInt(score, 10),
            icon,
            set: req.params.skillTreeName
        });
        await newSkill.save();
        res.redirect(`/skills/${req.params.skillTreeName}`);
    } catch (error) {
        res.status(500).render('error', { error: 'Error añadiendo la competencia' });
    }
});

router.get('/:skillTreeName/view/:skillID', isAuthenticated, async (req, res) => {
    const skill = await Skill.findOne({ id: req.params.skillID });
    if (!skill) return res.status(404).render('error', { error: 'Competencia no encontrada' });
    const evidences = await UserSkill.find({ skill: skill._id, verified: false });
    res.render('skill-view', { skill, evidences });
});

router.post('/:skillTreeName/:skillID/verify', isAuthenticated, async (req, res) => {
    const { userSkillId, approved } = req.body;
    try {
        const userSkill = await UserSkill.findById(userSkillId);
        if (!userSkill) return res.status(404).json({ error: 'UserSkill no encontrada' });
        userSkill.verified = approved === 'true';
        await userSkill.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error verificando la competencia' });
    }
});

router.get('/:skillTreeName/edit/:skillID', isAdmin, async (req, res) => {
    const skill = await Skill.findOne({ id: req.params.skillID });
    if (!skill) return res.status(404).render('error', { error: 'Competencia no encontrada' });
    res.render('edit-skill', { skill });
});

router.post('/:skillTreeName/submit-evidence', isAuthenticated, async (req, res) => {
    const { skillId, evidence, userSkillId } = req.body;
    try {
        if (userSkillId) {
            const userSkill = await UserSkill.findById(userSkillId);
            if (!userSkill) return res.status(404).json({ error: 'UserSkill no encontrada' });
            userSkill.evidence = evidence;
            await userSkill.save();
            return res.json({ success: true });
        }
        const newUserSkill = new UserSkill({
            user: req.session.user.id,
            skill: skillId,
            evidence
        });
        await newUserSkill.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error añadiendo la evidencia' });
    }
});

router.post('/:skillTreeName/delete/:skillID', isAdmin, async (req, res) => {
    try {
        await Skill.findOneAndDelete({ id: req.params.skillID });
        res.redirect(`/skills/${req.params.skillTreeName}`);
    } catch (error) {
        res.status(500).render('error', { error: 'Error eliminando la competencia' });
    }
});

module.exports = router;
