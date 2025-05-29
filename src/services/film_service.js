const Film = require('../models/film_model');
const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
const schema = Joi.object({
 
  title: Joi.string().required().min(3).max(30),
  description: Joi.string(),
  genre: Joi.string().required(),
  release: Joi.date().required(),
  director: Joi.string().required(),
  duration: Joi.number().min(0).required(),
  stock: Joi.number().required().min(0).required(),
  rental_price: Joi.number().required().min(0),
});

//Devuelve todas las películas
 async function getFilms() {
    const films = await Film.find();
    console.log(films);
    return films;
}

//Crea una nueva pelicula
async function newFilm(body) {
  //Validación de los datos de entrada
  const { error } = schema.validate({
    title: body.title,
    genre: body.genre,
    release: body.release,
    director: body.director,
    duration: body.duration,
    description: body.description,
    stock: body.stock,
    rental_price: body.rental_price,
  });

  if (error) return null;

  //Si la validación es correcta, creamos una nueva película
  const film = new Film({
    title: body.title,
    genre: body.genre,
    release: body.release,
    director: body.director,
    duration: body.duration,
    description: body.description,
    stock: body.stock,
    rental_price: body.rental_price,
  });

  const result = await film.save();
  const { __v, ...filmWithoutV } = result.toObject();
  return filmWithoutV;
}


//Devuelve una película por su id, comprobando que el id es válido
async function getFilmById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null; 
  }

  return await Film.findById(id).select({__v:0});
}

//Actualiza una película por su id, comprobando que el id es válido
async function updateFilmById(id, body) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  //Validación de los datos de entrada
  const { error } = schema.validate({
    title: body.title,
    genre: body.genre,
    release: body.release,
    description: body.description,
    director: body.director,
    duration: body.duration,
    stock: body.stock,
    rental_price: body.rental_price,
  });

  if (error) return null;
  
  //Si la validación es correcta, actualizamos la película
  const updated = await Film.findByIdAndUpdate(
    id,
    {
      title: body.title,
      description: body.description,
      genre: body.genre,
      release: body.release,
      director: body.director,
      duration: body.duration,
      stock: body.stock,
      rental_price: body.rental_price,
    },
    { new: true, projection: { __v: 0 } }
  );

  return updated;
}

//Borra una película por su id, comprobando que el id es válido
async function deleteFromID(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null; 
  }

  return await Film.findByIdAndDelete({_id:id});
}

//Devuelve la película con la fecha de lanzamiento más reciente
async function getLatestFilm() {

  const result = await Film.findOne().sort({release: -1});

  return result;
}

//Devuelve el número total de películas en la base de datos
async function getNumberAllFilms(){
  const result = await Film.countDocuments();
  return  result;
}

//Devuelve la película más antigua, comprobando que la fecha de lanzamiento no es nula
async function getOldestFilm(){
  const result = await Film.findOne({ release: { $ne: null } }).sort({release: 1});
  return result;
}

//Devuelve la película con el precio de alquiler más barato
async function getCheapest(){
 const result = await Film.findOne().sort({rental_price: 1 });
 return result;
}

//Devuelve la película con el precio de alquiler más caro
async function getExpensive(){
 const result = await Film.findOne().sort({rental_price: -1});
 return result;
}

//Devuelve la película con la duración más larga, comprobando que la duración no es nula
async function getLonguest(){
  const result = await Film.findOne({duration: {$ne: null }}).sort({release:1});
  return result;
}

module.exports={
  getFilms,newFilm, getFilmById,updateFilmById, deleteFromID, getLatestFilm,getNumberAllFilms,getOldestFilm,
  getCheapest, getExpensive,getLonguest
}