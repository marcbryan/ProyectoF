var BusinessUser = require('../models/BusinessUser');
var Business = require('../models/Business');
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

/**
 * Crea un negocio y después un usuario del negocio creado.
 * Se comprueba que el correo y el número de móvil no existan.
 */
exports.business_register = function(req, res) {
    console.log('[INFO] Business creation REQ at '+new Date());
    let business = req.body.business, user = req.body.user;
    let errMsg = 'No se ha podido crear tu negocio ni tu cuenta, faltan datos. Vuelve a intentarlo';
    if (isset(business) && isset(user)) {
        if (isset(user.password)) {
            user.password = BusinessUser.hashPassword(user.password);
        } else {
            res.status(403).send({status: 'ERROR', msg: errMsg});
            return;
        }
        // Comprobaciones
        let valid = true;
        let bFields = ['name', 'address', 'city', 'zipcode', 'phone'];
        let uFields = ['name', 'last_name', 'email', 'password', 'phone'];
        bFields.forEach(field => {
            if (!isset(business[field])) {
                valid = false;
            }
        });
        if (!valid) {
            res.status(403).send({status: 'ERROR', msg: errMsg});
            return;
        }
        uFields.forEach(field => {
            if (!isset(user[field])) {
                valid = false;
            }
        });
        if (!valid) {
            res.status(403).send({status: 'ERROR', msg: errMsg});
            return;
        }
        Object.keys(business).forEach(key => {
            if (!bFields.includes(key)) {
                delete business[key];
            }
        });
        Object.keys(user).forEach(key => {
            if (!uFields.includes(key)) {
                delete user[key];
            }
        });

        BusinessUser.find({
            $and: [ {$or: [{email: user.email}, {phone: user.phone}]} ]
        }, 'email phone', function(err, results) {
            if (err) {
                onErrorQuery(err, res);
                return;
            }
            if (results.length == 0) {
                // Guardamos el negocio y el usuario
                let mBusiness = new Business(business);
                mBusiness.save(function (err) {
                    if (err) {
                        onErrorQuery(err, res);
                        return;
                    }
                    let mUser = new BusinessUser(user);
                    mUser.business_id = mBusiness._id;
                    mUser.role = 'admin';
                    mUser.save(function (err) {
                        if (err) {
                            Business.deleteOne({_id: mBusiness._id});
                            onErrorQuery(err, res);
                            return;
                        }
                        res.send({status: 'OK', msg: 'Negocio y cuenta creados correctamente!'});
                        console.log('[INFO] Business registration completed!!');
                    }); 
                });
            } else {
                let emailUsed = false, phoneUsed = false;
                results.forEach(doc => {
                    if (doc.email == user.email) {
                        emailUsed = true;
                    }
                    if (doc.phone == user.phone) {
                        phoneUsed = true;
                    }
                });
                if (emailUsed && phoneUsed) {
                    res.status(403).send({status: 'ERROR', msg: 'El correo electrónico y el número de móvil de la nueva cuenta introducidos ya estan en uso'});
                }
                else if (emailUsed) {
                    res.status(403).send({status: 'ERROR', msg: 'El correo electrónico introducido ya está en uso'});
                } else {
                    res.status(403).send({status: 'ERROR', msg: 'El número de móvil de la nueva cuenta ya está en uso'});
                }
            }
        });
    } else {
        res.status(403).send({status: 'ERROR', msg: errMsg});
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