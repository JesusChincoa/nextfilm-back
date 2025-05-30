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
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    genre: "sci-fi",
    release: new Date("2010-07-16"),
    director: "Christopher Nolan",
    duration: 148,
    stock: 10,
    rental_price: 3.99,
    isActive: true
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    genre: "drama",
    release: new Date("1972-03-24"),
    director: "Francis Ford Coppola",
    duration: 175,
    stock: 5,
    rental_price: 4.99,
    isActive: true
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: "sci-fi",
    release: new Date("2014-11-07"),
    director: "Christopher Nolan",
    duration: 169,
    stock: 7,
    rental_price: 4.49,
    isActive: true
  },
  {
    title: "Shaun of the Dead",
    description: "A man's uneventful life is disrupted by a zombie apocalypse in this horror-comedy classic.",
    genre: "comedy",
    release: new Date("2004-04-09"),
    director: "Edgar Wright",
    duration: 99,
    stock: 6,
    rental_price: 3.49,
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
    title: "Frozen",
    description: "When a queen with icy powers accidentally curses her kingdom with eternal winter, her sister sets out to find her.",
    genre: "animated",
    release: new Date("2013-11-27"),
    director: "Chris Buck & Jennifer Lee",
    duration: 102,
    stock: 9,
    rental_price: 3.49,
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
