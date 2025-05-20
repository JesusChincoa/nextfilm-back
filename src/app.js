
const express = require('express');
const mongoose = require('mongoose')
const films = require('./routes/film_routes')
// const users = require('./routes/user_routes')
const swaggerUi = require('swagger-ui-express');


mongoose.connect('mongodb://localhost:27017/nextfilms')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('No se pudo conectar a MongoDB', err))

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//  app.use('/api', users)
 app.use('/api', films)
app.listen(3000, () =>{
    console.log('API Express escuchando...')

})

