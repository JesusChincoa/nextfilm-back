

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
        
    },
    director: {
        type: String,
       
    },
    duration: {
        type: Number,
       
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