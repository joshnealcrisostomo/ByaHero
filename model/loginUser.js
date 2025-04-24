require('dotenv').config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uri = process.env.MONGODB_URI;
const User = require('./UserSchema.js');

mongoose.connect(uri);

async function loginUser(username, password) {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password' };
        }
        
        // Don't include the password when returning the user object
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        
        return { success: true, user: userWithoutPassword };
    } catch (error) {
        console.error('Error in loginUser:', error);
        return { success: false, message: error.message || 'Internal server error' };
    }
}

module.exports = { loginUser };