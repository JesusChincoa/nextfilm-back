const jwt = require('jsonwebtoken')
const config = require('config')

//Comprueba el JSON Web Token (JWT) para verificar la autenticidad del usuario
let verificarToken = (req, res, next) =>{
    let token = req.get('Authorization');
    // Elimina el prefijo 'Bearer ' ya que se envia asi desde el frontend
    token = token.replace('Bearer ', '')
    jwt.verify(token, config.get(configToken.SEED), (err, decoded) =>{
        if (err){
            return res.status(401).json({err})
        }
        req.usuario = decoded.usuario
        next()
    })
}

//Comprueba el JSON Web Token (JWT) para verificar la autenticidad del usuario y si es administrador
let verificarTokenAdmin = (req, res, next) =>{
    let token = req.get('Authorization')
    // Elimina el prefijo 'Bearer ' ya que se envia asi desde el frontend
    token = token.replace('Bearer ', '')
    jwt.verify(token, config.get(configToken.SEED), (err, decoded) =>{
        if (err){
            return res.status(401).json({err})
        }
        if (!decoded.isAdmin) {
            return res.status(401).json({
                errorNumber: 401,
                message: 'You have no privilege',
            })
        }
        req.usuario = decoded.usuario
        next()
    })
}


 
module.exports ={
    verificarTokenAdmin,
    verificarToken
} 