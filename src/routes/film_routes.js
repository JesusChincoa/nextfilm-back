const express = require('express');

const filmService = require('../services/film_service');

export const ruta = express.Router();

ruta.get('/getFilms' , (req, res) => {
  const resultado = filmService.getFilms();
  resultado
    .then((films) => res.status(200).json(films))
    .catch((err) => res.status(400).json({ error: err }));
});


ruta.post('/newFilm' , (req, res) => {
  const resultado = filmService.newFilm(req.body);

  if(resultado == null) return res.status(400).json({
    errorNumber: 400,
    message: 'Datos de película introducidos son incorrectos'
  });

  resultado
    .then((films) => res.status(200).json(films))
    .catch((err) => res.status(500).json({
      errorNumber: 500,
      message: 'Error al intentar guardar la nueva película'
    }));
});