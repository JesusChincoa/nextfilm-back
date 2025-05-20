const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id_user: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('Usuario', userSchema)