const express = require("express");
const Usuario = require("../model/usuarioModel");
const Joi = require("@hapi/joi");


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

  resultado
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(400).json({ error: err }));
});