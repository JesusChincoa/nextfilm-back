
const express = require('express');
const mongoose = require('mongoose')
const films = require('./routes/film_routes')
// const users = require('./routes/user_routes')



mongoose.connect('mongodb://localhost:27017/nextfilm')
    .then(() => console.log('Connecting to MongoDB'))
    .catch(err => console.error('error connecting MongoDB', err))

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//  app.use('/api', users)
 app.use('/api', films)
app.listen(3000, () =>{
    console.log('API Express Listening...')

})

