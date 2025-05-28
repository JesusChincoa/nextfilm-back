const express = require('express');
const userService = require('../services/user_services');
const ruta = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/).required(), //Mayuscula, minuscula, numero y caracter especial ($@$!%*?&)
})

//Endpoint para crear un nuevo usuario en la base de datos.
ruta.post('/register', async (req, res) =>{
    let body = req.body;

    try{
        const {error, value} = schema.validate({name: body.name, email: body.email, password: body.password});
        if(error){
            return res.status(400).json({
                errorNumber: 400,
                error: 'Error en los datos de registro',
                error
            })
        }

        let existingUser = await userService.obtenerUsuario(body.email)
        if(existingUser){
            return res.status(400).json({
                errorNumber: 400,
                error: 'Usuario ya registrado',
                user:{
                    _id: existingUser._id,
                    name: existingUser.name,
                    isAdmin: existingUser.isAdmin,
                    email: existingUser.email,
                }
            })
        }

        let usuario = userService.crearUsuario(body);

        usuario.then(user =>{
            const token = jwt.sign({_id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin}, 'clave_secreta', {expiresIn: '24h'})
            res.status(201).json({
                token: token,
                user:{
                    _id: user._id,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    email: user.email,
                }

            })
        })
    }
    catch(err){
        res.status(500).json({
            errorNumber: 500,
            error: 'Error en el servidor',
        })
    }

})

//Endpoint para iniciar sesión en la aplicación
ruta.post('/login', (req, res) => {
    let body = req.body;

    userService.obtenerUsuario(body.email).then(user => {
        if(!user){
            return res.status(400).json({
                error: 'Usuario no encontrado'
            })
        }

        if(!bcrypt.compareSync(body.password, user.password)){
            return res.status(400).json({
                error: 'Contraseña incorrecta'
            })
        }

        const token = jwt.sign({_id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin}, 'clave_secreta', {expiresIn: '24h'})
        res.status(200).json({
            token: token,
            user:{
                _id: user._id,
                name: user.name,
                isAdmin: user.isAdmin,
                email: user.email,
            }
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

//Endpoint que compruueba el estado del token para ver si el usuario sigue activo
ruta.post('/checkStatus', (req, res) => {
    let token = req.body.token

    userService.encontrarToken(token).then(user => {
        if(!user){
            return res.status(400).json({
                error: 'Token no activo'
            })
        }
        const token = jwt.sign({_id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin}, 'clave_secreta', {expiresIn: '24h'})
        res.status(200).json({
            token: token,
            user:{
                _id: user._id,
                name: user.name,
                isAdmin: user.isAdmin,
                email: user.email,
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

//Endpoint para obtener todos los usuarios
ruta.get('/getUsers', (req, res) => {
    userService.getUsers().then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = ruta;