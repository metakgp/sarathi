import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
