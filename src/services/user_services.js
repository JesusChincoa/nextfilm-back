const Usuario = require('../models/user_model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function crearUsuario(body){
    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        isAdmin: body.isAdmin
    })
    return await usuario.save()
}

async function obtenerUsuario(email){
    let usuario = await Usuario.findOne({email: email})
    .select({_id:1, name:1, isAdmin:1, email:1, password:1})

    return usuario
}

async function obtenerUsuarioPorId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null; // Así devuelves null y puedes responder con 400 en la ruta
    }
    let usuario = await Usuario.findById(id)
    .select({_id:1, name:1, isAdmin:1, email:1, password:1})

    return usuario

}


async function obtenerUsuarioIdFromToken(token){
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, 'clave_secreta');

        return decoded._id;
    }
    catch (err) {
        // Token inválido o expirado
        return null;
    }

}

async function encontrarToken(token){
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, 'clave_secreta');

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

async function getUsers(){
    return await Usuario.find().select({_id:1, name:1, email:1});
}

module.exports = {obtenerUsuarioIdFromToken, crearUsuario, obtenerUsuario, encontrarToken, obtenerUsuarioPorId, getUsers}