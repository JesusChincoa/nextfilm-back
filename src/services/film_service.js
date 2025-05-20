const Film = require("../models/film_model");


const schema = Joi.object({
 
  titulo: Joi.string().required().min(3).max(30),
  descripcion: Joi.string().min(3).max(30),
  genero: Joi.string().required(),
  estreno: Joi.number(),
  director: Joi.string(),
  duracion: Joi.number().min(0),
  stock: Joi.number().required().min(0),
  precio_alquiler: Joi.number().required().min(0),
});

export async function getFilms() {
    return await Film.find();
}

export async function newFilm(body){
  const {error} = schema.validate({
    titulo: body.titulo,
    descripcion: body.descripcion,
    genero: body.genero,
    estreno: body.estreno,
    director: body.director,
    duracion: body.duracion,
    stock: body.stock,
    precio_alquiler: body.precio_alquiler,
  });

  if(error ) return null;

  const film = new Film({
    titulo: body.titulo,
    descripcion: body.descripcion,
    genero: body.genero,
    estreno: body.estreno,
    director: body.director,
    duracion: body.duracion,
    stock: body.stock,
    precio_alquiler: body.precio_alquiler,
  });


  return await film.save();
}