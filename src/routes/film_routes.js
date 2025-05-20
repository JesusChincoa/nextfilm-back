const express = require('express');

const filmService = require('../services/film_service');

const ruta = express.Router();

ruta.get('/getFilms' , (req, res) => {
  const resultado = filmService.getFilms();
  resultado
    .then((films) => res.status(200).json(films))
    .catch((err) => res.status(500).json({
      errorNumber: 500,
      message: 'Error al intentar guardar la nueva película' + err
    }));
});

ruta.get('/getFilm/:id', (req, res) => {
  const resultado = filmService.getFilmById(req.params.id);

  resultado
    .then((film) => {
      if (!film) {
        return res.status(400).json({
          errorNumber: 400,
          message: 'Película no encontrada',
        });
      }
      res.status(200).json(film);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'Error al buscar la película: ' + err,
      })
    );
});



ruta.post('/newFilm' , (req, res) => {
  const resultado = filmService.newFilm(req.body);

  if(resultado == null) return res.status(400).json({
    errorNumber: 400,
    message: 'Datos de película introducidos son incorrectos'
  });

  resultado
    .then((films) => res.status(200).json(films))
    .catch((err) => res.status(500).json({
      errorNumber: 500,
      message: 'Error al intentar guardar la nueva película' + err
    }));
});

ruta.put('/updateFilm/:id', (req, res) => {
  const resultado = filmService.updateFilmById(req.params.id, req.body); // ✅ añade req.body

  resultado
    .then((film) => {
      if (!film) {
        return res.status(400).json({
          errorNumber: 400,
          message: 'Película no encontrada o datos inválidos',
        });
      }
      res.status(200).json(film);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'Error al actualizar la película: ' + err,
      })
    );
});


ruta.delete('/deleteFilm/:id', (req,res) => {
  const resultado = filmService.deleteFromID(req.params.id);

  resultado
    .then((film) => {
      if (!film) {
        return res.status(400).json({
          errorNumber: 400,
          message: 'Película no encontrada',
        });
      }
      res.status(200).json("Pelicula eliminada: "+film);
    })
    .catch((err) =>
      res.status(500).json({
        errorNumber: 500,
        message: 'Error al buscar la película: ' + err,
      })
    );
})


module.exports=ruta