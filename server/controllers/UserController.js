var User = require('../models/User');
var validator = require('email-validator');
var jwt = require('jsonwebtoken');
require('dotenv').config();

/** Comprueba si los datos enviados por un usuario son válidos para hacer login (POST) */
exports.user_login = function (req, res) {
    let email = req.body.email;
    let pass = User.hashPassword(req.body.password);
    // Log para ver en consola los datos
    console.log('[INFO] Login REQ at '+new Date()+' -> { email: "'+email+'", pass: "'+pass+'" }');
    
    if (isset(email) && isset(pass)) {
        User.findOne({email: email, password: pass}, '-_id -__v -credit_card', function(err, document) {
            if (err) {
                onErrorQuery();
                return;
            }
            if (isset(document)) {
                let user = new User(document);
                let token = jwt.sign({}, process.env.PRIVATE_KEY);
                let session = { token: token, expiresIn: 2592000 }; // 30 días
                res.send({status: 'OK', msg: 'Bienvenido '+user.name+'!', data: user.toJSON(), session: session});
            } else {
                res.status(403).send({status: 'ERROR', msg: 'Correo electrónico y/o contraseña incorrectos'});
            }
        });
    } else {
        res.status(403).send({status: 'ERROR', msg: 'Correo electrónico y/o contraseña incorrectos'});
    }
}

/** 
 * Se encarga de crear un usuario por POST.
 * Además se valida si el correo electrónico y el móvil no estan en uso por otros usuarios.
 */
exports.user_create_post = function(req, res) {
    console.log('[INFO] User creation REQ at '+new Date());
    if (isset(req.body.name) && isset(req.body.last_name) && isset(req.body.email) && isset(req.body.password) && isset(req.body.city) && isset(req.body.zipcode) && isset(req.body.phone)) {
        if (!validator.validate(req.body.email)) {
            res.status(403).send({status: 'ERROR', msg: 'El formato del correo electrónico es incorrecto. Vuelve a intentarlo'});
        } else {
            User.find({
                $and: [ {$or: [{email: req.body.email}, {phone: req.body.phone}]} ]
            }, 'email phone', function(err, results) {
                if (err) {
                    onErrorQuery();
                    return;
                }
                if (results.length == 0) {
                    let newUser = new User(req.body);
                    newUser.setPasswordAsHash();
                    console.log(newUser);
                    newUser.save(function (err) {
                        if (err) {
                            onErrorQuery();
                            return;
                        }
                        res.send({status: 'OK', msg: 'Cuenta creada correctamente'});
                        console.log('[INFO] User created succesfully!!');
                    });
                    return;
                }
                let emailUsed = false, phoneUsed = false;
                results.forEach(user => {
                    if (user.email == req.body.email) {
                        emailUsed = true;
                    }
                    if (user.phone == req.body.phone) {
                        phoneUsed = true;
                    }
                });
                if (emailUsed && phoneUsed) {
                    res.status(403).send({status: 'ERROR', msg: 'El correo electrónico y el número de móvil introducidos ya estan en uso'});
                }
                else if (emailUsed) {
                    res.status(403).send({status: 'ERROR', msg: 'El correo electrónico introducido ya está en uso'});
                }
                else if (phoneUsed) {
                    res.status(403).send({status: 'ERROR', msg: 'El número de móvil introducido ya está en uso'});
                }
            });
        }
    } else {
        res.status(403).send({status: 'ERROR', msg: 'Faltan datos para poder crear la cuenta. Vuelve a intentarlo'});
    }
}

/** Se encarga de actualizar datos de un usuario por POST */
exports.user_update_post = function(req, res) {
    res.send('UPDATE No implementado');
}


function isset(value) {
    if (value !== undefined && value != null && value != '') {
        return true;
    }
    return false;
}

function onErrorQuery() {
    console.log(err);
    res.status(403).send({status: 'ERROR', msg: 'Error de base de datos, intentalo más tarde.'});
}