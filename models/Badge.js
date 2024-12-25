const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    bitpoints_min: {
        type: Number,
        required: true
    },
    bitpoints_max: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
        required: true
    }
});

badgeSchema.pre('save', function(next) {
    if (this.bitpoints_min > this.bitpoints_max) {
        return next(new Error('bitpoints_min no puede ser mayor que bitpoints_max'));
    }
    next();
});

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
