const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const Skill = require('../models/Skill');
const User = require('../models/User');
const UserSkill = require('../models/UserSkill');
const {Types} = require("mongoose");

router.get('/', isAuthenticated, (req, res) => {
    res.redirect('/skills/electronics');
});

router.get('/:skillTreeName', isAuthenticated, async (req, res) => {
    try {
        const skillTreeName = req.params.skillTreeName;
        const skills = await Skill.find({ set: skillTreeName });
        const totalSkills = await Skill.countDocuments();
        const completedSkills = req.user?.completedSkills || [];
        const admin = req.session.user.admin;
        const userScore = req.user.score;

        res.render('index', {
            skillTreeName,
            skills,
            totalSkills,
            completedSkills,
            username: req.session.user.username,
            userScore,
            isAdmin: admin
        });
    } catch (error) {
        console.error('Error al renderizar el index:', error);
        res.status(500).render('error', { error: 'Error interno del servidor' });
    }
});


router.get('/:skillTreeName/add', isAdmin, (req, res) => {
    res.render('add-skill', { skillTreeName: req.params.skillTreeName });
});

router.get('/:skillTreeName/all', async (req, res) => {

    try {

        if (!req.session || !req.session.user) {
            return res.redirect('/users/login');
        }

        const user = await User.findOne({ username: req.session.user.username });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado.' });
        }

        const skillTreeName = req.params.skillTreeName;
        const skills = await Skill.find({ set: skillTreeName });

        if (!skills.length) {
            return res.status(404).json({ error: 'No se encontraron habilidades para este conjunto.' });
        }

        const userSkills = await UserSkill.find({ user: user._id }).populate('skill');

        const userSkillsMap = userSkills.reduce((acc, userSkill) => {
            acc[userSkill.skill._id.toString()] = {
                isCompleted: userSkill.completed,
                verificationsCount: userSkill.verifications.length,
            };
            return acc;
        }, {});

        const skillsWithAdditionalInfo = skills.map(skill => {
            const skillData = userSkillsMap[skill._id.toString()] || {
                isCompleted: false,
                verificationsCount: 0
            };

            return {
                ...skill.toObject(),
                isCompleted: skillData.isCompleted,
                verificationsCount: skillData.verificationsCount
            };
        });

        const unverifiedEvidences = await UserSkill.find({ verified: false })
            .populate('skill', 'id')
            .populate('user', 'username')
            .exec();

        const verifiedEvidences = await UserSkill.find({ user: user._id, verified: true })
            .populate('skill', 'id')
            .populate('user', 'username')
            .exec();

        const verifiedBySkill = verifiedEvidences.reduce((acc, evidence) => {
            const skillId = evidence.skill.id;
            if (!acc[skillId]) {
                acc[skillId] = [];
            }
            acc[skillId].push(evidence);
            return acc;
        }, {});

        const unverifiedBySkill = unverifiedEvidences.reduce((acc, evidence) => {
            const skillId = evidence.skill.id;
            if (!acc[skillId]) {
                acc[skillId] = [];
            }
            acc[skillId].push(evidence);
            return acc;
        }, {});

        res.json({
            skills: skillsWithAdditionalInfo,
            evidencesBySkill: {
                unverifiedEvidences: unverifiedBySkill,
                verifiedEvidences: verifiedBySkill,
            },
        });

    } catch (error) {
        console.error('Error al obtener habilidades y evidencias:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

router.get('/:skillID/get-by-id', isAuthenticated, async (req, res) => {
    try {
        const skill = await Skill.findOne({ id: req.params.skillID });
        // Comprobar si el usuario logueado la ha completado
        // Buscar con findone el usuario actual
        const user = await User.findOne({ username: req.session.user.username });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        // Buscar en UserSkill si el usuario tiene la skill completada
        const userSkill = await UserSkill.findOne({ user: user._id, skill: skill._id });
        const isCompleted = userSkill ? userSkill.completed : false;

        if (!skill) {
            return res.status(404).json({ error: 'Skill no encontrada' });
        }

        res.json({
            skill,
            isCompleted
        });
    } catch (error) {
        console.error('Error al obtener la skill:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:skillTreeName/view', isAuthenticated, async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).render('error', { error: 'ID de la competencia no proporcionado.' });
    }

    try {
        const skill = await Skill.findOne({ id });
        if (!skill) {
            return res.status(404).render('error', { error: 'Competencia no encontrada.' });
        }

        const evidences = await UserSkill.find({ skill: skill._id, verified: false });
        res.render('view-skill', { skill, evidences, isAdmin: req.session.user.admin, currentUsername: req.session.user.username });
    } catch (error) {
        console.error('Error al buscar la competencia:', error);
        res.status(500).render('error', { error: 'Error interno del servidor.' });
    }
});

router.get('/:skillTreeName/edit/:skillID', isAdmin, async (req, res) => {
    const skill = await Skill.findOne({ id: req.params.skillID });
    if (!skill) return res.status(404).render('error', { error: 'Competencia no encontrada' });
    res.render('edit-skill', { skill });
});


router.get('/:skillId/evidences', isAuthenticated, async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect('/users/login');
        }

        const skillId = req.params.skillId;

        const skill = await Skill.findOne({ id: skillId });
        if (!skill) {
            return res.status(404).json({ error: 'Skill no encontrado.' });
        }

        const evidences = await UserSkill.find({ skill: skill._id })
            .populate('user', 'username')
            .populate('skill', 'text');

        if (!evidences.length) {
            return res.status(404).json({ error: 'No se encontraron evidencias para esta habilidad.' });
        }

        const user = await User.findOne({ username: req.session.user.username });


        const enrichedEvidences = evidences.map(evidence => {
            const enrichedEvidence = evidence.toObject();
            enrichedEvidence.verifiedByUser = false;

            evidence.verifications.forEach(verification => {
                if (verification.toString() === user._id.toString()) {
                    enrichedEvidence.verifiedByUser = true;
                }
            });

            return enrichedEvidence;
        });

        console.log(enrichedEvidences);

        res.json(enrichedEvidences);

    } catch (error) {
        console.error('Error al obtener las evidencias:', error);
        res.status(500).json({ error: 'Error al obtener las evidencias' });
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

router.post('/evidence/:evidenceId/verify', isAuthenticated, async (req, res) => {
    const { evidenceId } = req.params;

    try {
        const { ObjectId } = Types;
        if (!ObjectId.isValid(evidenceId)) {
            return res.status(400).json({ error: 'ID de evidencia inválido' });
        }

        const userSkillEvidence = await UserSkill.findById(evidenceId).populate('skill');
        if (!userSkillEvidence) {
            return res.status(404).json({ error: 'Evidencia no encontrada' });
        }

        const user = await User.findOne({ username: req.session.user.username });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (!userSkillEvidence.verifications.includes(user._id)) {
            userSkillEvidence.verifications.push(user._id);
        } else {
            return res.status(400).json({ error: 'Usuario ya ha verificado esta evidencia' });
        }

        if (userSkillEvidence.verifications.length >= 2) {
            userSkillEvidence.completed = true;
            userSkillEvidence.verified = true;
            userSkillEvidence.completedAt = new Date();

            const owner = await User.findById(userSkillEvidence.user);
            if (!owner.completedSkills.includes(userSkillEvidence.skill.id)) {
                owner.completedSkills.push(userSkillEvidence.skill.id);
                owner.score += userSkillEvidence.skill.score; // Incrementar el puntaje del usuario
                await owner.save();
            }
        }

        await userSkillEvidence.save();

        res.json({
            success: true,
            message: userSkillEvidence.completed
                ? 'Evidencia verificada y marcada como completada.'
                : 'Evidencia verificada exitosamente.'
        });
    } catch (error) {
        console.error('Error al registrar la verificación:', error);
        res.status(500).json({ error: 'Error al registrar la verificación' });
    }
});

router.post('/:skillTreeName/:skillId/submit-evidence', isAuthenticated, async (req, res) => {
    const { evidence } = req.body;
    const skillId = req.params.skillId;
    const skillTreeName = req.params.skillTreeName;

    try {

        const user = await User.findOne({ username: req.session.user.username });
        if (!user) {
            return res.redirect('/users/login');
        }

        const skill = await Skill.findOne({ id: skillId, set: skillTreeName });
        if (!skill) {
            return res.status(404).json({ error: 'Skill no encontrado.' });
        }

        userSkill = new UserSkill({
            user: user._id,
            skill: skill._id,
            evidence
        });
        await userSkill.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error al enviar la evidencia:', error);
        res.status(500).json({ error: 'Error al enviar la evidencia' });
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

router.post('/:skillTreeName/edit/:skillID', isAdmin, async (req, res) => {
    try {
        const { text, icon, set, tasks, description, score } = req.body;

        const updatedSkill = await Skill.findOneAndUpdate(
            { id: req.params.skillID },
            {
                text,
                icon,
                set,
                tasks: tasks.split(',').map(task => task.trim()),
                description,
                score: parseInt(score, 10)
            },
            { new: true }
        );

        if (!updatedSkill) {
            return res.status(404).render('error', { error: 'Competencia no encontrada' });
        }

        res.redirect(`/skills/${req.params.skillTreeName}`);
    } catch (error) {
        console.error('Error actualizando la competencia:', error);
        res.status(500).render('error', { error: 'Error actualizando la competencia' });
    }
});

router.post('/evidence/:evidenceId/approve', isAdmin, async (req, res) => {
    try {
        const { evidenceId } = req.params;

        const evidence = await UserSkill.findById(evidenceId).populate('skill');
        if (!evidence) {
            return res.status(404).json({ error: 'Evidencia no encontrada' });
        }

        evidence.verified = true;
        evidence.completed = true;
        evidence.completedAt = new Date();

        const owner = await User.findById(evidence.user);
        if (!owner.completedSkills.includes(evidence.skill.id)) {
            owner.completedSkills.push(evidence.skill.id);
            owner.score += evidence.skill.score;
            await owner.save();
        }

        await evidence.save();

        res.json({ success: true, message: 'Evidencia aprobada y marcada como completada.' });
    } catch (error) {
        console.error('Error al aprobar la evidencia:', error);
        res.status(500).json({ error: 'Error al aprobar la evidencia' });
    }
});


router.post('/evidence/:evidenceId/reject', isAdmin, async (req, res) => {
    try {
        const { evidenceId } = req.params;

        const evidence = await UserSkill.findByIdAndDelete(evidenceId);
        if (!evidence) {
            return res.status(404).json({ error: 'Evidencia no encontrada' });
        }

        res.json({ success: true, message: 'Evidencia rechazada' });
    } catch (error) {
        console.error('Error al rechazar la evidencia:', error);
        res.status(500).json({ error: 'Error al rechazar la evidencia' });
    }
});


module.exports = router;
