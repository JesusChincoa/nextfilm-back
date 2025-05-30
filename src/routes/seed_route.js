const express = require("express");

const Usuario = require("../models/user_model");
const Rental = require("../models/rental_model");
const Film = require("../models/film_model");

const filmService = require("../services/film_service");
const userService = require("../services/user_services");
const rentalService = require("../services/rental_services");
const rute = express.Router();

rute.get("/seed", async (req, res) => {
  try {
    await seedDatabase();

    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({
      errorNumber: 500,
      message: "An error occurred while seeding the database: " + error,
    });
  }
});

async function seedDatabase() {
  // Delete all rentals
  const rentals = await getRentals();
  rentals.forEach(async (rental) => {
    await deleteRental(rental._id);
  });

  // Delete all films
  const films = await getAllFilms();

  films.forEach(async (film) => {
    await deleteFilmFromID(film._id);
  });

  // Delete all users
  const users = await getUsers();

  users.forEach(async (user) => {
    await deleteUserFromID(user._id);
  });

  genres = [
    "action",
    "horror",
    "comedy",
    "sci-fi",
    "drama",
    "animated",
    "musical",
  ];

  const seedFilms = [
  {
    title: "Mad Max: Fury Road",
    description: "In a post-apocalyptic wasteland, Max teams up with a mysterious woman to flee from a cult leader and his army.",
    genre: "action",
    release: new Date("2015-05-15"),
    director: "George Miller",
    duration: 120,
    stock: 10,
    rental_price: 4.49,
    isActive: true
  },
  {
    title: "The Conjuring",
    description: "Paranormal investigators help a family terrorized by a dark presence in their farmhouse.",
    genre: "horror",
    release: new Date("2013-07-19"),
    director: "James Wan",
    duration: 112,
    stock: 8,
    rental_price: 3.99,
    isActive: true
  },
  {
    title: "The Grand Budapest Hotel",
    description: "A comedy about a legendary concierge at a famous European hotel and his adventures with a lobby boy.",
    genre: "comedy",
    release: new Date("2014-03-28"),
    director: "Wes Anderson",
    duration: 99,
    stock: 7,
    rental_price: 3.49,
    isActive: true
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: "sci-fi",
    release: new Date("2014-11-07"),
    director: "Christopher Nolan",
    duration: 169,
    stock: 6,
    rental_price: 4.99,
    isActive: true
  },
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of decency.",
    genre: "drama",
    release: new Date("1994-09-23"),
    director: "Frank Darabont",
    duration: 142,
    stock: 10,
    rental_price: 4.49,
    isActive: true
  },
  {
    title: "Coco",
    description: "Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    genre: "animated",
    release: new Date("2017-11-22"),
    director: "Lee Unkrich",
    duration: 105,
    stock: 9,
    rental_price: 3.99,
    isActive: true
  },
  {
    title: "La La Land",
    description: "A jazz musician and an aspiring actress fall in love while pursuing their dreams in Los Angeles.",
    genre: "musical",
    release: new Date("2016-12-09"),
    director: "Damien Chazelle",
    duration: 128,
    stock: 5,
    rental_price: 4.29,
    isActive: true
  }
];




  for (let i = 0; i < seedFilms.length; i++) {
    await filmService.newFilm(seedFilms[i]);
  }


  await userService.crearUsuario({
    name: `admin`,
    email: `admin@admin.com`,
    password: `admin`,
    isAdmin: true,
  });
    await userService.crearUsuario({
    name: `user`,
    email: `user@email.com`,
    password: `user`,
    isAdmin: false,
  });
  

}

async function deleteRental(id) {
  return await Rental.findByIdAndDelete({ _id: id });
}

async function getRentals() {
  return await Rental.find();
}

async function getAllFilms() {
  const films = await Film.find()
  return films;
  
}

async function deleteUserFromID(id) {
  return await Usuario.findByIdAndDelete({ _id: id });
}

async function deleteFilmFromID(id) {
  return await Film.findByIdAndDelete({ _id: id });
}

async function getUsers() {
  return await Usuario.find();
}

module.exports = rute;
