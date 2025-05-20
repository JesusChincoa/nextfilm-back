const express = require('express');
const userService = require('../services/user_services');
const ruta = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const schema = Joi.object({
    nombre: Joi.string().required(),
    email: Joi.string().required()
})

ruta.post('/register', (req, res) =>{
    let body = req.body;

    const {error, value} = schema.validate({nombre: body.nombre, email: body.email});
    if(!error){
        let usuario = userService.crearUsuario(body);

        usuario.then(user =>{
            const token = jwt.sign({_id: user._id, nombre: user.nombre, email: user.email}, 'clave_secreta', {expiresIn: '24h'})
            res.status(201).json({
                token: token,
                user:{
                    id_user: user._id,
                    nombre: user.nombre,
                    isAdmin: user.isAdmin,
                    email: user.email,
                }

            })
        }).catch(err =>{
            res.status(400).json({
            errorNumber: 400,
            error: 'El usuario ya existe'
                })
        })
    }
})

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

        const token = jwt.sign({_id: user._id, nombre: user.nombre, email: user.email}, 'clave_secreta', {expiresIn: '24h'})
        res.status(200).json({
            token: token,
            user:{
                id_user: user._id,
                nombre: user.nombre,
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

ruta.post('/checkStatus', (req, res) => {
    let token = req.body.token

    userService.encontrarToken(token).then(user => {
        if(!user){
            return res.status(401).json({
                error: 'Token inválido'
            })
        }
        const token = jwt.sign({_id: user._id, nombre: user.nombre, email: user.email}, 'clave_secreta', {expiresIn: '24h'})
        res.status(200).json({
            token: token,
            user:{
                id_user: user._id,
                nombre: user.nombre,
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

module.exports = ruta;