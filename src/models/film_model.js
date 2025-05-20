

const mongoose = require('mongoose');

export const filmSchema = new mongoose.Schema({
    
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true
    },
    estreno: {
        type: Number,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    precio_alquiler:{
        type: Number,
        required: true
    }

});