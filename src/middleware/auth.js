const jwt = require('jsonwebtoken')
const config = require('config')
 
let verificarToken = (req, res, next) =>{
    let token = req.get('Authorization');
    token = token.replace('Bearer ', '')
    jwt.verify(token, 'clave_secreta', (err, decoded) =>{
        if (err){
            return res.status(401).json({err})
        }
        req.usuario = decoded.usuario
        next()
    })
}


let verificarTokenAdmin = (req, res, next) =>{
    let token = req.get('Authorization')
    token = token.replace('Bearer ', '')
    jwt.verify(token, 'clave_secreta', (err, decoded) =>{
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