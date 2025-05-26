const express = require('express');

const filmService = require('../services/film_service');
const {verificarToken} = require('../middleware/auth');
const rute = express.Router();


rute.get('/filmNews', verificarToken, (req, res) => {
  
  const LatestFilm = filmService.getLatestFilm();
  const TotalFilms = filmService.getNumberAllFilms();
  const OldestFilm = filmService.getOldestFilm();
  const CheapestFilm = filmService.getCheapest();
  const ExpensiveFilm = filmService.getExpensive();
  const LonguestFilm = filmService.getLonguest();
    
    Promise.all([LatestFilm, TotalFilms, OldestFilm,CheapestFilm,ExpensiveFilm,LonguestFilm])
    .then(([latest, total,oldest,cheap,expensive,longuest]) => {
        const result = {
            LatestFilm: latest,
            TotalFilms: total,
            OldestFilm: oldest,
            CheapestFilm: cheap,
            LonguestFilm: longuest,
            ExpensiveFilm: expensive,
            



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