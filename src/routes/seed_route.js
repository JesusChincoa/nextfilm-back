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
    seedDatabase();

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
    await delteRental(rental._id);
  });

  // Delete all films
  const films = await filmService.getFilms();

  films.forEach(async (film) => {
    await filmService.deleteFromID(film._id);
  });

  // Delete all users
  const users = await getUsers();

  users.forEach(async (user) => {
    await deleteFromID(user._id);
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




  for (let i = 0; i < 10; i++) {
    // Generate a random release date between 1990 and today
    const start = new Date(1990, 0, 1).getTime();
    const end = new Date().getTime();
    const randomRelease = new Date(start + Math.random() * (end - start));

    await filmService.newFilm({
      title: `Film ${i}`,
      description: `Description for Film ${i}`,
      genre: `${genres[i % genres.length]}`,
      release: randomRelease,
      director: "Director Name",
      duration: 60 + Math.floor(Math.random() * 120), // Random duration between 60 and 180 minutes
      stock: 10 - i,
      rental_price: 5.99 + Math.floor(Math.random() * 10), 
    });
  }

  for (let i = 0; i < 10; i++) {
    await userService.crearUsuario({
      name: `User ${i}`,
      email: `email${i}@email.com`,
      password: `password${i}`,
      isAdmin: i % 2 === 0,
    });
  }

  for (let i = 0; i < 10; i++) {
    let user = await Usuario.findOne({ email: `email${i}@email.com` });
    let film = await Film.findOne({ title: `Film ${i}` });
    await rentalService.createRental({
      userId: user._id,
      filmId: film._id,
      paid: i % 2 === 0,
      price: 5.99 + i,
    });
  }
}

async function delteRental(id) {
  return await Rental.findByIdAndDelete({ _id: id });
}

async function getRentals() {
  return await Rental.find();
}

async function deleteFromID(id) {
  return await Usuario.findByIdAndDelete({ _id: id });
}

async function getUsers() {
  return await Usuario.find();
}

module.exports = rute;
