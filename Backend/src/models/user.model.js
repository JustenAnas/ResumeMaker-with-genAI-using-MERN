const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true,'username already existed'],
        trim: true,
        minLength: [3, "Username must be at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true,'Account already existed with this email'],
        lowercase: true, // Converts 'User@Example.com' to 'user@example.com'
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"]
    }
}, { 
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;