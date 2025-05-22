

const mongoose = require('mongoose');

 const filmSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
      
    },
    genre: {
        type: String,
        required: true
    },
    release: {
        type: Date,
        required: true,
    },
    director: {
        type: String,
        required: true,
       
    },
    duration: {
        type: Number,
        required: true,
       
    },
    stock: {
        type: Number,
        required: true
    },
    rental_price:{
        type: Number,
        required: true
    }

});
module.exports= mongoose.model('Film', filmSchema);