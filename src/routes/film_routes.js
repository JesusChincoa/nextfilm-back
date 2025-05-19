const express = require('express');

const filmService = require('../services/film_service');

const ruta = express.Router();

const schema = Joi.object({
 
  titulo: Joi.string().required().min(3).max(30),
  descripcion: Joi.string().min(3).max(30),
  genero: Joi.string().required(),
  estreno: Joi.number(),
  director: Joi.string(),
  duracion: Joi.number().min(0),
  stock: Joi.number().min(0),
  precio_alquiler: Joi.number().min(0),
  
});


ruta.get("/getFilms" , (req, res) => {
  const resultado = filmService.getFilms();
  resultado
    .then((films) => res.status(200).json(films));
    // .catch((err) => res.status(400).json({ error: err }));
});