const Rental = require('../models/rental_model');
const mongoose = require('mongoose');

async function showRentals(){
    return await Rental.find().select({__v:0});
}

async function getRentalById(id){
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return null; // Así devuelves null y puedes responder con 400 en la ruta
        }
    return await Rental.findById(id).select({__v:0});
    
}

async function getRentalsByUserId(userId){
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null; // Así devuelves null y puedes responder con 400 en la ruta
    }
    return await Rental.find({userId: userId}).select({__v:0});
}

async function searchExistingRental(userId, filmId){
    let rental = await Rental.findOne({userId: userId, filmId: filmId})
    .select({__v:0})
    return rental
}


async function createRental(body){
    let rental = new Rental({
        userId: body.userId,
        filmId: body.filmId,
        paid: body.paid,
        price: body.price,
    })
    return await rental.save()
}

async function updateRental(rental, body) {
    rental.userId = body.userId;
    rental.filmId = body.filmId;
    rental.paid = body.paid;
    rental.price = body.price;
    rental.rentalDate = body.rentalDate;
    rental.expectedReturnDate = body.expectedReturnDate;

    return await rental.save();
}

module.exports = {showRentals, getRentalById, searchExistingRental, updateRental ,createRental, getRentalsByUserId}