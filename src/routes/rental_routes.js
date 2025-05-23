const express = require("express");
const rentalService = require("../services/rental_services");
const usersService = require("../services/user_services");
const filmService = require("../services/film_service");
const ruta = express.Router();
const Joi = require("@hapi/joi");
const { verificarTokenAdmin, verificarToken } = require("../middleware/auth");

const schema = Joi.object({
  userId: Joi.string().required(),
  filmId: Joi.string().required(),
  paid: Joi.boolean().required(),
  price: Joi.number(),
});

ruta.get("/getRentals", verificarTokenAdmin, (req, res) => {
  const result = rentalService.showRentals();
  result
    .then((rentals) => res.status(200).json(rentals))
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        error: "Error en el servidor",
        err,
      })
    );
});

ruta.get("/getRental/:id", verificarToken, (req, res) => {
  const result = rentalService.getRentalById(req.params.id);
  result
    .then((rental) => {
      if (!rental) {
        return res.status(400).json({
          errorNumber: 400,
          error: "Alquiler no encontrado",
        });
      }
      res.status(200).json(rental);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        error: "Error en el servidor",
        err,
      })
    );
});

ruta.get("/getRentalsByUser/:userId", verificarToken, (req, res) => {
  const result = rentalService.getRentalsByUserId(req.params.userId);
  result
    .then((rentals) => {
      if (!rentals) {
        return res.status(400).json({
          errorNumber: 400,
          error: "Alquiler no encontrado",
        });
      }
      res.status(200).json(rentals);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        error: "Error en el servidor",
        err,
      })
    );
});

ruta.post("/newRental", verificarTokenAdmin, async (req, res) => {
  let body = req.body;

  try {
    const { error } = schema.validate({
      userId: body.userId,
      filmId: body.filmId,
      paid: body.paid,
      price: body.price,
    });

    if (error)
      return res.status(400).json({
        errorNumber: 400,
        message: "Datos incorrectos ingresados",
      });

    let existingUser = await usersService.obtenerUsuarioPorId(body.userId);
    if (!existingUser)
      return res.status(400).json({
        errorNumber: 400,
        error: "Usuario no encontrado",
      });

    let existingFilm = await filmService.getFilmById(body.filmId);
    if (!existingFilm)
      return res.status(400).json({
        errorNumber: 400,
        error: "Pelicula no encontrada",
      });

    let existingRental = await rentalService.searchExistingRental(
      body.userId,
      body.filmId
    );
    if (existingRental)
      return res.status(400).json({
        errorNumber: 400,
        error: "El usuario ya ha alquilado la pelicula",
      });

    let rental = await rentalService.createRental(body);
    res.status(200).json({
      rentalID: rental._id,
      userId: rental.userId,
      filmId: rental.filmId,
      paid: rental.paid,
      price: rental.price,
      rentalDate: rental.rentalDate,
      expedtedReturnDate: rental.expectedReturnDate,
      returnDate: rental.returnDate,
    });
  } catch (err) {
    return res.status(500).json({
      errorNumber: 500,
      error: "Error en el servidor",
      err,
    });
  }
});

ruta.put("/updateRental/:id", verificarTokenAdmin, async (req, res) => {
  let rental = await rentalService.getRentalById(req.params.id);
  let body = req.body;

  try {
    if (!rental)
      return res.status(400).json({
        errorNumber: 400,
        error: "Alquiler no encontrado",
      });
    const { error } = schema.validate({
      userId: body.userId,
      filmId: body.filmId,
      paid: body.paid,
      price: body.price,
    });
    if (error)
      return res.status(400).json({
        errorNumber: 400,
        message: "Datos incorrectos ingresados",
      });
    await rentalService.updateRental(rental, body);
    res.status(200).json({
      rentalID: rental._id,
      userId: rental.userId,
      filmId: rental.filmId,
      paid: rental.paid,
      price: rental.price,
      rentalDate: rental.rentalDate,
      expectedReturnDate: rental.expectedReturnDate,
      returnDate: rental.returnDate,
    });
  } catch (err) {
    return res.status(500).json({
      errorNumber: 500,
      error: "Error en el servidor",
      err,
    });
  }
});

ruta.put("/returnRental/:id", verificarTokenAdmin, async (req, res) => {
  let rental = await rentalService.returnRental(req.params.id);

  if (!rental)
    return res.status(400).json({
      errorNumber: 400,
      error: "Alquiler no encontrado",
    });

  res.status(200).json(rental);
});

module.exports = ruta;
