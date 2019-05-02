const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    age: {
        type: Number
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;