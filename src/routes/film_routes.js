const express = require('express');

const filmService = require('../services/film_service');
const {verificarToken, verificarTokenAdmin} = require('../middleware/auth');
const rute = express.Router();

//Endpoint que devuelve todas las películas de la base de datos
rute.get('/getFilms' ,verificarToken, (req, res) => {
  const result = filmService.getFilms();
  result
    .then((films) => res.status(200).json(films))
    .catch((err) => res.status(500).json({
      errorNumber: 500,
      message: 'An error ocurred while searching the movies' + err
    }));
});

//Endpoint que devuelve una película por su id
rute.get('/getFilm/:id', verificarToken,  (req, res) => {
  const result = filmService.getFilmById(req.params.id);

  result
    .then((film) => { //Si la película no existe, devuelve un error 400
      if (!film) {
        return res.status(400).json({
          errorNumber: 400,
          message: 'Movie not found',
        });
      }
      res.status(200).json(film);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'An error ocurred while searching the movie: ' + err,
      })
    );
});


//Endpoint que crea una nueva película (administrador)
rute.post('/newFilm' ,verificarTokenAdmin, (req, res) => {
  const result = filmService.newFilm(req.body);
  //Si la validación de los datos de entrada falla, devuelve un error 400
  if(result == null) return res.status(400).json({
    errorNumber: 400,
    message: 'Incorrect film data entered'
  });

  result
  //Si la validación no falla, lanza el 201 y devuelve la película creada
    .then((films) => res.status(201).json(films))
    .catch((err) => res.status(500).json({
      errorNumber: 500,
      message: 'An error has ocurred while saving the new film' + err
    }));
});

//Endpoint que actualiza una película por su id (administrador)
rute.put('/updateFilm/:id',verificarTokenAdmin, (req, res) => {
  const result = filmService.updateFilmById(req.params.id, req.body); 

  result
    .then((film) => {
      if (!film) {
        return res.status(400).json({ //Si los datos introducidos son incorrectos o la película no existe, devuelve un error 400
          errorNumber: 400,
          message: 'Data invalid or movie not found',
        });
      }
      res.status(200).json(film);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'An error has ocurred while updating the movie: ' + err,
      })
    );
});

//Endpoint que elimina una película por su id (administrador)
rute.delete('/deleteFilm/:id', verificarTokenAdmin, (req,res) => {
  const result = filmService.deleteFromID(req.params.id);

  
  result
    .then((film) => {
      if (!film) {
        return res.status(400).json({ //Si los datos introducidos son incorrectos no encontrará la película y devuelve un error 400
          errorNumber: 400,
          message: 'Movie not found',
        });
      }
      res.status(200).json('Film deleted'); //Si los datos introducidos son correctos elimina la película y devuelve un mensaje de éxito
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'An error has ocurred while searching the movie: ' + err,
      })
    );
})


module.exports=rute