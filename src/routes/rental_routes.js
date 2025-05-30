const express = require("express");
const rentalService = require("../services/rental_services");
const usersService = require("../services/user_services");
const filmService = require("../services/film_service");
const ruta = express.Router();
const Joi = require("@hapi/joi");
const RentalDTO = require("../dtos/rentalDto");
const { verificarTokenAdmin, verificarToken } = require("../middleware/auth");
const e = require("express");

const schema = Joi.object({
  userId: Joi.string().required(),
  filmId: Joi.string().required(),
  price: Joi.number(),
});

//Devuelve todos los alquileres
ruta.get("/getRentals", verificarTokenAdmin, (req, res) => {
  const result = rentalService.showRentals();
  result
    .then((rentals) =>
      rentalService.rentalToDTO(rentals).then((rentalsDTO) => {
        res.status(200).json(rentalsDTO);
      })
    )
    .catch((err) =>
      res.status(400).json({
        errorNumber: 400,
        error: "Error al obtener los alquileres",
        err,
      })
    )
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        error: "Error en el servidor",
        err,
      })
    );
});

//Devuelve un alquiler por id que recibe por parametro
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
      rentalService
        .mapRentalToDTO(rental)
        .then((rentalsDTO) => {
          res.status(200).json(rentalsDTO);
        })
        .catch((err) =>
          res.status(400).json({
            errorNumber: 400,
            error: "Error al pasar a DTO",
            err,
          })
        );
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        error: "Error en el servidor",
        err,
      })
    );
});

//Devuelve todos los alquileres de un usuario por id que recibe por parametro
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
      rentalService
        .rentalToDTO(rentals)
        .then((rentalsDTO) => {
          res.status(200).json(rentalsDTO);
        })
        .catch((err) =>
          res.status(400).json({
            errorNumber: 400,
            error: "Error al obtener los alquileres",
            err,
          })
        );
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        error: "Error en el servidor",
        err,
      })
    );
});

//Crea un nuevo alquiler recibiendo por body el id del usuario, el id de la pelicula, el precio y si está pagado o no
ruta.post("/newRental", verificarTokenAdmin, async (req, res) => {
  let body = req.body;

  try {
    const { error } = schema.validate({
      userId: body.userId,
      filmId: body.filmId,
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

    if (existingFilm.stock <= 0)
      return res.status(400).json({
        errorNumber: 400,
        error: "No hay stock disponible",
      });

    let allRentals = await rentalService.searchExistingRental(
      body.userId,
      body.filmId
    );

    let existingRental = allRentals.find(r => r.returnDate === null);
    if (existingRental)
      return res.status(400).json({
        errorNumber: 400,
        error: "El usuario ya ha alquilado la pelicula",
      });


     existingFilm.stock = existingFilm.stock - 1;
     await filmService.updateFilmById(existingFilm._id, existingFilm);

    let rental = await rentalService.createRental(body);


    res.status(200).json(rental);
  } catch (err) {
    return res.status(500).json({
      errorNumber: 500,
      error: "Error en el servidor",
      err,
    });
  }
});

//Actualiza un alquiler recibiendo por body el id del usuario, el id de la pelicula, el precio, si está pagado o no y la fecha de devolución nueva.
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

    if (existingFilm.stock <= 0)
      return res.status(400).json({
        errorNumber: 400,
        error: "No hay stock disponible",
      });

    if(rental.filmId === existingFilm._id && rental.userId === existingUser._id){
      let allRentals = await rentalService.searchExistingRental(
      body.userId,
      body.filmId
    );

    let existingRental = allRentals.find(r => r.returnDate === null);
    if (existingRental)
      return res.status(400).json({
        errorNumber: 400,
        error: "El usuario ya ha alquilado la pelicula",
      });

    }
    if (existingFilm.id !== rental.filmId) {
      // la nueva pelicula no es la misma que la anterior
      existingFilm.stock = existingFilm.stock - 1;
      await filmService.updateFilmById(existingFilm._id, existingFilm);
      let previousFilm = await filmService.getFilmById(rental.filmId);
      previousFilm.stock = previousFilm.stock + 1;
      await filmService.updateFilmById(previousFilm._id, previousFilm);
    }

    let updatedRental = await rentalService.updateRental(rental, body);
    res.status(200).json(updatedRental);
  } catch (err) {
    return res.status(500).json({
      errorNumber: 500,
      error: "Error en el servidor",
      err,
    });
  }
});

//Recibe un id de alquiler por parametro y devuelve el alquiler, además de actualizar el stock de la película.
ruta.put("/returnRental/:id", verificarTokenAdmin, async (req, res) => {
  let rental = await rentalService.returnRental(req.params.id);

  if (!rental)
    return res.status(400).json({
      errorNumber: 400,
      error: "Alquiler no encontrado",
    });

  let existingFilm = await filmService.getFilmById(rental.filmId);

  existingFilm.stock = existingFilm.stock + 1;
  await filmService.updateFilmById(existingFilm._id, existingFilm);
  let rentalDTO = await rentalService.mapRentalToDTO(rental);
  res.status(200).json(rentalDTO);
});


ruta.post("/newBook/:idFilm", verificarToken, async (req, res) => {
  try {
    let token = req.get("Authorization");
    token = token.replace("Bearer ", "");

    const userId = await usersService.obtenerUsuarioIdFromToken(token);

    let existingFilm = await filmService.getFilmById(req.params.idFilm);

    if (!existingFilm)
      return res.status(400).json({
        errorNumber: 400,
        error: "Pelicula no encontrada",
      });

    if (existingFilm.stock <= 0)
      return res.status(400).json({
        errorNumber: 400,
        error: "No hay stock disponible",
      });

    let allRentals = await rentalService.searchExistingRental(
      userId,
      req.params.idFilm
    );

    let existingRental = allRentals.find(r => r.returnDate === null);
    if (existingRental)
      return res.status(400).json({
        errorNumber: 400,
        error: "El usuario ya ha reservado/alquilado la pelicula",
      });

    existingFilm.stock = existingFilm.stock - 1;
    await filmService.updateFilmById(existingFilm._id, existingFilm);

    const result = await rentalService.createBook(userId, req.params.idFilm, existingFilm.rental_price);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      errorNumber: 500,
      error: "Error en el servidor",
      err,
    });
  }
});

module.exports = ruta;
