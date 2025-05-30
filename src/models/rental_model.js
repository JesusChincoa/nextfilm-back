const mongoose = require('mongoose')

const rentalSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    filmId: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    bookDate: {
        type: Date,
        default: () => Date.now()
    },
    rentalDate: {
        type: Date,
        default: () => Date.now()
    },
    expectedReturnDate: {
        type: Date,
        default: () => Date.now() + (2 * 7 * 24 * 60 * 60 * 1000)
    },
    returnDate: {
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('Rentals', rentalSchema)