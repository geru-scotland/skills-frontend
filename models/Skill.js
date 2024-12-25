const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: null
    },
    set: {
        type: String,
        required: true
    },
    tasks: {
        type: [String],
        default: []
    },
    resources: {
        type: [{ name: String, url: String }],
        default: []
    },
    description: {
        type: String,
        default: ''
    },
    score: {
        type: Number,
        default: 1
    }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
