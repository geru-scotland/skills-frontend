const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    evidence: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifications: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
});

const UserSkill = mongoose.model('UserSkill', userSkillSchema);

module.exports = UserSkill;
