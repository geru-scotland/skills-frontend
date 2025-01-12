const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  admin: {
    type: Boolean,
    default: false
  },
  completedSkills: {
    type: [String],
    default: []
  },
  badge:{
    type: String,
    default: 'Observador'
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.password.startsWith('$2b$')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;