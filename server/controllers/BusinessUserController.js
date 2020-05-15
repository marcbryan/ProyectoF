var BusinessUser = require('../models/BusinessUser');
var validator = require('email-validator');
var jwt = require('jsonwebtoken');
require('dotenv').config();

/** Comprueba si los datos enviados por un usuario de un negocio son válidos para hacer login (POST) */
exports.business_user_login = function (req, res) {
    let email = req.body.email;
    let pass = BusinessUser.hashPassword(req.body.password);
    // Log para ver en consola los datos
    console.log('[INFO] Business Login REQ at '+new Date()+' -> { email: "'+email+'", pass: "'+pass+'" }');
    
    if (isset(email) && isset(pass)) {
        BusinessUser.findOne({email: email, password: pass}, '-__v', function(err, doc) {
            if (err) {
                onErrorQuery(err, res);
                return;
            }
            if (isset(doc)) {
                let user = new BusinessUser(doc);
                let token = jwt.sign({}, process.env.PRIVATE_KEY);
                let session = { token: token, expiresIn: 2592000 }; // 30 días
                user.access_token = token;
                user.save();
                res.send({status: 'OK', msg: 'Bienvenido '+user.name+'!', data: user.toJSON(), session: session});
            } else {
                res.status(403).send({status: 'ERROR', msg: 'Correo electrónico y/o contraseña incorrectos'});
            }
        });
    } else {
        res.status(403).send({status: 'ERROR', msg: 'Correo electrónico y/o contraseña incorrectos'});
    }
}


// Funciones
function isset(value) {
    if (value !== undefined && value != null && value != '') {
        return true;
    }
    return false;
}

function onErrorQuery(err, res) {
    console.log(err);
    res.status(403).send({status: 'ERROR', msg: 'Error de base de datos, intentalo más tarde.'});
}