const Rental = require('../models/rental_model');
const RentalDTO = require("../dtos/rentalDto")
const mongoose = require('mongoose');
const {getFilmById} = require('./film_service');
const {obtenerUsuarioPorId} = require('./user_services');

//Devuelve todos los alquileres
async function showRentals(){
    return await Rental.find().select({__v:0});
}

//Devuelve un alquiler por id, comprobando que el id es válido
async function getRentalById(id){
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return null; // Así devuelves null y puedes responder con 400 en la ruta
        }
    return await Rental.findById(id).select({__v:0});
    
}

//Devuelve todos los alquileres de un usuario por su id, comprobando que el id es válido
async function getRentalsByUserId(userId){
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null; // Así devuelves null y puedes responder con 400 en la ruta
    }
    return await Rental.find({userId: userId}).select({__v:0});
}

//Busca un alquiler existente por userId y filmId
async function searchExistingRental(userId, filmId){
    let rental = await Rental.find({userId: userId, filmId: filmId})
    .select({__v:0})
    return rental
}

//Crea un nuevo alquiler
async function createRental(body){
    let rental = new Rental({
        userId: body.userId,
        filmId: body.filmId,
        paid: body.paid,
        price: body.price,
    })
    return await rental.save()
}

//Crea una nueva reserva
async function createBook(userId, filmId){
    let rental = new Rental({
        userId: userId,
        filmId: filmId,
        rentalDate: null,
        expectedReturnDate: null,

    });
    return await rental.save()
}

//Actualiza un alquiler existente
async function updateRental(rental, body) {
    rental.userId = body.userId;
    rental.filmId = body.filmId;
    rental.paid = body.paid;
    rental.price = body.price;
    rental.rentalDate = body.rentalDate;
    rental.expectedReturnDate = body.expectedReturnDate;

    if (body.returnDate) {
        rental.returnDate = new Date(body.returnDate); 
    }
    return await rental.save();
}

//Añade la fecha de devolución a un alquiler existente que se envia por parametro, indicando que ya se ha devuelto la película.
async function returnRental(idRental) {
    let rental = await Rental.findById(idRental);

    if (!rental) 
        return null; // Rental not found


    rental.returnDate = new Date();
    
    return await rental.save();
}

//Recibe un alquiler y lo mapea a un DTO, añadiendo el nombre del usuario y de la película por sus ids.
async function mapRentalToDTO(rental){
    let [user, film] = await Promise.all([
            obtenerUsuarioPorId(rental.userId),
            getFilmById(rental.filmId)
        ]);
        if (!user || !film) return null; // Si no se encuentra el usuario o la película, retorna null
        return new RentalDTO({
            _id: rental._id,
            userName: user.name,
            userId: user._id,
            filmName: film.title,
            filmId: film._id,
            price: rental.price,
            bookDate: rental.bookDate,
            rentalDate: rental.rentalDate,
            expectedReturnDate: rental.expectedReturnDate,
            returnDate: rental.returnDate
        })
     
}

//Mapea un array de alquileres a un array de DTOs
async function rentalToDTO(rentals){
    const dtos = await Promise.all(rentals.map(mapRentalToDTO));
    return dtos
}

module.exports = {createBook, showRentals, getRentalById, searchExistingRental, updateRental ,createRental, getRentalsByUserId, returnRental, mapRentalToDTO, rentalToDTO}