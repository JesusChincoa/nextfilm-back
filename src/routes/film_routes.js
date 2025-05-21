const express = require('express');

const filmService = require('../services/film_service');
const {verificarToken, verificarTokenAdmin} = require('../middleware/auth');
const rute = express.Router();

rute.get('/getFilms' ,verificarToken, (req, res) => {
  const result = filmService.getFilms();
  result
    .then((films) => res.status(200).json(films))
    .catch((err) => res.status(500).json({
      errorNumber: 500,
      message: 'An error ocurred while searching the movies' + err
    }));
});

rute.get('/getFilm/:id', verificarToken,  (req, res) => {
  const result = filmService.getFilmById(req.params.id);

  result
    .then((film) => {
      if (!film) {
        return res.status(400).json({
          errorNumber: 400,
          message: 'Movie not found',
        });
      }
      res.status(200).json(film);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'An error ocurred while searching the movie: ' + err,
      })
    );
});



rute.post('/newFilm' ,verificarTokenAdmin, (req, res) => {
  const result = filmService.newFilm(req.body);

  if(result == null) return res.status(400).json({
    errorNumber: 400,
    message: 'Incorrect film data entered'
  });

  result
    .then((films) => res.status(200).json(films))
    .catch((err) => res.status(500).json({
      errorNumber: 500,
      message: 'An error has ocurred while saving the new film' + err
    }));
});

rute.put('/updateFilm/:id',verificarTokenAdmin, (req, res) => {
  const result = filmService.updateFilmById(req.params.id, req.body); 

  result
    .then((film) => {
      if (!film) {
        return res.status(400).json({
          errorNumber: 400,
          message: 'Data invalid or movie not found',
        });
      }
      res.status(200).json(film);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'An error has ocurred while updating the movie: ' + err,
      })
    );
});


rute.delete('/deleteFilm/:id', verificarTokenAdmin, (req,res) => {
  const result = filmService.deleteFromID(req.params.id);

  
  result
    .then((film) => {
      if (!film) {
        return res.status(400).json({
          errorNumber: 400,
          message: 'Movie not found',
        });
      }
      res.status(200).json('👍');
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'An error has ocurred while searching the movie: ' + err,
      })
    );
})


module.exports=rute