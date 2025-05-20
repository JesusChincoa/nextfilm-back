const Film = require('../models/film_model');
const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
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

 async function getFilms() {
    return await Film.find();
}

async function newFilm(body) {
  const { error } = schema.validate({
    titulo: body.titulo,
    genero: body.genero,
    stock: body.stock,
    precio_alquiler: body.precio_alquiler,
  });

  if (error) return null;

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

  const result = await film.save();
  const { __v, ...filmWithoutV } = result.toObject();
  return filmWithoutV;
}



async function getFilmById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null; 
  }

  return await Film.findById(id).select({__v:0});
}

async function updateFilmById(id, body) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const { error } = schema.validate({
    titulo: body.titulo,
    genero: body.genero,
    stock: body.stock,
    precio_alquiler: body.precio_alquiler,
  });

  if (error) return null;

  const updated = await Film.findByIdAndUpdate(
    id,
    {
      titulo: body.titulo,
      descripcion: body.descripcion,
      genero: body.genero,
      estreno: body.estreno,
      director: body.director,
      duracion: body.duracion,
      stock: body.stock,
      precio_alquiler: body.precio_alquiler,
    },
    { new: true, projection: { __v: 0 } }
  );

  return updated;
}

async function deleteFromID(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null; 
  }

  return await Film.findByIdAndDelete({_id:id});
}


module.exports={
  getFilms,newFilm, getFilmById,updateFilmById, deleteFromID
}