

const mongoose = require('mongoose');

export const filmSchema = new mongoose.Schema({
    
    titulo: {
        type: String,
        require: true
    },
    descripcion: {
        type: String,
        require: true
    },
    genero: {
        type: String,
        require: true
    },
    estreno: {
        type: Number,
        require: true
    },
    director: {
        type: String,
        require: true
    },
    duracion: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    precio_alquiler:{
        type: Number,
        require: true
    }

});