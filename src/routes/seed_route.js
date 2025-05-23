const express = require('express');

const Usuario = require('../models/user_model'); // temporal

const filmService = require('../services/film_service');
const userService = require('../services/user_services');
const rute = express.Router();

rute.get('/seed', async (req, res) => {
  try {
    
    seedDatabase();

    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({
      errorNumber: 500,
      message: 'An error occurred while seeding the database: ' + error,
    });
  }
});



async function seedDatabase() {

    const films = await filmService.getFilms();

    films.forEach(async (film) => {
        await filmService.deleteFromID(film._id);
    });


    const users = await getUsers();

    users.forEach(async (user) => {
        await deleteFromID(user._id);
    });

    for(let i = 0; i < 10; i++) {
        await filmService.newFilm({
            title: `Film ${i}`,
            description: `Description for Film ${i}`,
            genre: 'action',
            release: new Date(),
            director: 'Director Name',
            duration: 60 + i*2,
            stock: 10 - i,
            rental_price: 5.99 + i + Math.random(),
        });
    }



    for(let i = 0; i < 10; i++) {
        await userService.crearUsuario({
            name: `User ${i}`,
            email: `email${i}@email.com`,
            password: `password${i}`,
            isAdmin: i % 2 === 0
        });
    }


}


async function deleteFromID(id) {
    return await Usuario.findByIdAndDelete({_id:id});
}

async function getUsers() {
    return await Usuario.find();
}



module.exports = rute;