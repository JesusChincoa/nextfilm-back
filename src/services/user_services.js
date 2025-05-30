const Usuario = require('../models/user_model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

//Crea un nuevo usuario y lo guarda en la base de datos
async function crearUsuario(body){
    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        isAdmin: body.isAdmin
    })
    return await usuario.save()
}

//Obtiene un usuario por su email
async function obtenerUsuario(email){
    let usuario = await Usuario.findOne({email: email})
    .select({_id:1, name:1, isAdmin:1, email:1, password:1})

    return usuario
}

//Obtiene un usuario por su id, comprobando que el id es válido
async function obtenerUsuarioPorId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null; // Así devuelves null y puedes responder con 400 en la ruta
    }
    let usuario = await Usuario.findById(id)
    .select({_id:1, name:1, isAdmin:1, email:1, password:1})

    return usuario

}

//Obtiene el id del usuario a partir del token JWT
async function obtenerUsuarioIdFromToken(token){
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, config.get('configToken.SEED'));

        return decoded._id;
    }
    catch (err) {
        // Token inválido o expirado
        return null;
    }

}

//Busca un usuario por su token, devuelve el usuario si es válido o null si no lo es
async function encontrarToken(token){
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, config.get('configToken.SEED'));

        // Buscar al usuario por ID
        const usuario = await Usuario.findOne({email: decoded.email})
        .select({_id:1, name:1, isAdmin:1, email:1, password:1})

        // Si no se encuentra el usuario, devuelve null
        if (!usuario) {
            return null;
        }
        // Usuario válido

        return usuario;
        
    } catch (err) {
        // Token inválido o expirado
        return null;
    }
}

//Devuelve todos los usuarios con su id, nombre y email
async function getUsers(){
    return await Usuario.find().select({_id:1, name:1, email:1});
}

module.exports = {obtenerUsuarioIdFromToken, crearUsuario, obtenerUsuario, encontrarToken, obtenerUsuarioPorId, getUsers}