const Film = require('../models/film_model');
const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
const schema = Joi.object({
 
  title: Joi.string().required().min(3).max(30),
  description: Joi.string().min(3).max(30),
  genre: Joi.string().required(),
  release: Joi.date().required(),
  director: Joi.string().required(),
  duration: Joi.number().min(0).required(),
  stock: Joi.number().required().min(0).required(),
  rental_price: Joi.number().required().min(0),
});

 async function getFilms() {
    return await Film.find();
}

async function newFilm(body) {
  const { error } = schema.validate({
    title: body.title,
    genre: body.genre,
    release: body.release,
    director: body.director,
    duration: body.duration,
    stock: body.stock,
    rental_price: body.rental_price,
  });

  if (error) return null;


  const film = new Film({
    title: body.title,
    genre: body.genre,
    release: body.release,
    director: body.director,
    duration: body.duration,
    stock: body.stock,
    rental_price: body.rental_price,
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
    title: body.title,
    genre: body.genre,
    release: body.release,
    director: body.director,
    duration: body.duration,
    stock: body.stock,
    rental_price: body.rental_price,
  });

  if (error) return null;

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

async function deleteFromID(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null; 
  }

  return await Film.findByIdAndDelete({_id:id});
}

async function getLatestFilm() {

  const result = await Film.findOne().sort({release: -1});

  return result;
}
async function getNumberAllFilms(){
  const result = await Film.countDocuments();
  return  result;
}
async function getOldestFilm(){
  const result = await Film.findOne({ release: { $ne: null } }).sort({release: 1});
  return result;
}
async function getCheapest(){
 const result = await Film.findOne().sort({rental_price: 1 });
 return result;
}
async function getExpensive(){
 const result = await Film.findOne().sort({rental_price: -1});
 return result;
}
async function getLonguest(){
  const result = await Film.findOne({duration: {$ne: null }}).sort({release:1});
  return result;
}

module.exports={
  getFilms,newFilm, getFilmById,updateFilmById, deleteFromID, getLatestFilm,getNumberAllFilms,getOldestFilm,
  getCheapest, getExpensive,getLonguest
}