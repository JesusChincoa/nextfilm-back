const express = require('express');

const filmService = require('../services/film_service');
const {verificarToken} = require('../middleware/auth');
const rute = express.Router();


rute.get('/home', verificarToken, (req, res) => {
  
  const LatestFilm = filmService.getLatestFilm();
  const TotalFilms = filmService.getNumberAllFilms();
  const OldestFilm = filmService.getOldestFilm();
  const Cheapest = filmService.getCheapest();
  const Expensive = filmService.getExpensive();
  const Longuest = filmService.getLonguest();
    
    Promise.all([LatestFilm, TotalFilms, OldestFilm,Cheapest,Expensive,Longuest])
    .then(([latest, total,oldest,cheap,expensive,longuest]) => {
        const result = {
            LatestFilm: latest,
            TotalFilms: total,
            OldestFilm: oldest,
            Cheapest: cheap,
            Longuest: longuest,
            Expensive: expensive,
            



    };
        res.status(200).json(result);
    })
    .catch((err) =>
        res.status(500).json({
            errorNumber: 500,
            message: 'An error occurred while searching the movies: ' + err,
    })
  );

});


module.exports=rute