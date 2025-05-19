const Film = require("../models/film_model");


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

export async function getFilms() {
    return await Film.find();
}