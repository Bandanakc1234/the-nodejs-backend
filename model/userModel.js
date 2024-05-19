const mongoose = require('mongoose')
// const uuidv1 = require('uuidv1')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'others']
    },
    role: {
        type: Number, //0-normal user, 1-admin user, 2-super admin user
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


module.exports = mongoose.model("User", userSchema)
