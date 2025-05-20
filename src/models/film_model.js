

const mongoose = require('mongoose');

 const filmSchema = new mongoose.Schema({
    
    titulo: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
      
    },
    genero: {
        type: String,
        required: true
    },
    estreno: {
        type: Number,
        
    },
    director: {
        type: String,
       
    },
    duracion: {
        type: Number,
       
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
module.exports= mongoose.model('Film', filmSchema);