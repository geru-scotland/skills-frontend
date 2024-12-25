const User = require('../models/User');

// ***************************************
// Login
// ***************************************
async function loginUser(username, password) {
    if (!username || !password) {
        throw new Error('Por favor, completa todos los campos.');
    }

    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Usuario o contraseña incorrectos.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Usuario o contraseña incorrectos.');
    }

    return { id: user._id, username: user.username, role: user.role };
}

// ***************************************
// Register
// ***************************************
async function registerUser(username, password, password2) {
    if (!username || !password || !password2) {
        throw new Error('Por favor, completa todos los campos.');
    }

    if (password !== password2) {
        throw new Error('Las contraseñas no coinciden.');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('El nombre de usuario ya está en uso.');
    }

    const newUser = new User({ username, password });
    await newUser.save();

    return { id: newUser._id, username: newUser.username, role: newUser.role };
}

module.exports = {
    loginUser,
    registerUser
};


