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
        User.findOne({email: email, password: pass}, '-__v -credit_card', function(err, document) {
            if (err) {
                onErrorQuery(err, res);
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
                    onErrorQuery(err, res);
                    return;
                }
                if (results.length == 0) {
                    let newUser = new User(req.body);
                    newUser.setPasswordAsHash();
                    console.log(newUser);
                    newUser.save(function (err) {
                        if (err) {
                            onErrorQuery(err, res);
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

/** 
 * Se encarga de actualizar datos de un usuario por POST.
 * Si se actualiza el número de móvil, se comprobará que no exista.
 * Si se actualiza la contraseña, se verificará que la contraseña antigua
 * enviada concuerda con la de la base de datos.
 */
exports.user_update_post = function(req, res) {
    console.log('[INFO] User update REQ at '+new Date());
    let uid = req.body.uid;
    if (isset(uid)) {
        var oldPassword = req.body.oldPassword, newPassword = req.body.newPassword;
        var updatePhone = false, onlyPhoneOrPwd = true, empty = true, update = {}, errors = [];
        const fields = ['name', 'last_name', 'city', 'zipcode', 'phone'];
        fields.forEach(field => {
            if (isset(req.body[field])) {
                if (field == 'phone') {
                    updatePhone = true;
                } else {
                    onlyPhoneOrPwd = false;
                }
                update[field] = req.body[field];
                empty = false;
            }
        });

        var updatePassword = isset(oldPassword) && isset(newPassword);

        if (empty && !updatePassword) {
            res.status(403).send({status: 'ERROR', msg: 'Hacen falta datos para poder actualizar tu usuario'});
            return;
        }

        if (updatePhone) {
            User.find({phone: req.body.phone}, 'phone', {limit: 1}, function(err, docs) {
                if (err) {
                    onErrorQuery(err, res);
                    return;
                }
                if (docs.length > 0) {
                    errors.push('El número de móvil no ha sido actualizado, ya existe');
                    delete update.phone;
                }
                if (updatePassword) {
                    User.findById({_id: uid}, callback_update_password);
                } else {
                    User.updateOne({_id: uid}, update, callback_update);
                }
            });
        } else {
            if (updatePassword) {
                User.findById({_id: uid}, callback_update_password);
            } else {
                User.updateOne({_id: uid}, update, callback_update);
            }
        }
    } else {
        res.status(403).send({status: 'ERROR', msg: 'Hace falta un identificador para poder actualizar un usuario. Vuelve a intentarlo'});
    }


    // Callbacks
    function callback_update_password(err, doc) {
        if (err) {
            onErrorQuery(err, res);
            return;
        }
        if (doc) {
            let hash = User.hashPassword(oldPassword);
            if (hash == doc.password) {
                update.password = User.hashPassword(newPassword);
            } else {
                errors.push('La contraseña antigua no es correcta, no se ha podido actualizar la contraseña');
            }
            User.updateOne({_id: uid}, update, callback_update);
        }
    }

    function callback_update(err, raw) {
        if (err) {
            onErrorQuery(err, res);
            return;
        }
        if (raw.nModified < 1) {
            let msg = 'Ha habido un error al actualizar los datos de tu usuario';
            if (errors.length > 0) {
                res.status(403).send({status: 'ERROR', msg: msg, errors: errors});
            } else {
                res.status(403).send({status: 'ERROR', msg: msg});
            }
            return;
        }
        let msg = 'Se han actualizado los datos del usuario correctamente';
        if (onlyPhoneOrPwd && (updatePhone != updatePassword)) {
            if (errors.length > 0) {
                res.status(403).send({status: 'ERROR', msg: errors[0]});
            } else {
                res.send({status: 'OK', msg: msg});
            }
        } else {
            if (errors.length > 0) {
                res.send({status: 'P', msg: 'Se han actualizado parcialmente los datos del usuario', errors: errors});
            } else {
                res.send({status: 'OK', msg: msg});
            }
        }
    }
}

/**
 * Se encarga de añadir/eliminar un evento de los favoritos del usuario
 */
exports.user_favourite_events = function(req, res) {
    let uid = req.body.uid, event_id = req.body.event_id, fav = req.body.fav;
    if (isset(uid) && isset(event_id) && isset(fav)) {
        fav = !!JSON.parse(String(fav).toLowerCase());
        if (fav == true || !fav) {
            let options = { $pull: { fav_events: event_id} };
            if (fav == true) {
                options = { $addToSet: { fav_events: event_id} };
            }
            User.updateOne({_id: uid}, options, function(err, raw) {
                if (err) {
                    onErrorQuery(err, res);
                    return;
                }
                if (raw.nModified < 1) {
                    res.status(403).send({status: 'ERROR', msg: 'Ha habido un error al añadir/eliminar el evento a favoritos'});
                    return;
                }
                let msg = '';
                if (!fav) {
                    msg = 'Eliminado de favoritos';
                } else {
                    msg = 'Añadido a favoritos';
                }
                res.send({status: 'OK', msg: msg});
            });
        } else {
            res.status(403).send({status: 'ERROR', msg: 'Formato incorrecto, no se puede actualizar'});
        }
    } else {
        res.status(403).send({status: 'ERROR', msg: 'Faltan datos para poder añadir/eliminar el evento a favoritos'});
    }
}

/**
 * Se encarga de añadir a un amigo si la dirección de correo del amigo existe
 */
exports.user_add_friend = function(req, res) {
    let uid = req.body.uid, email = req.body.email;
    console.log('[INFO] Add friend REQ at '+new Date()+' { uid:'+uid+', friend: '+email+' }');
    
    if (isset(uid) && isset(email)) {
        User.findOne({email: email}, function(err, doc) {
            if (err) {
                onErrorQuery(err, res);
                return;
            }
            if (!doc) {
                res.status(403).send({status: 'ERROR', msg: 'No hay ningún usuario con este correo electrónico'});
            } else {
                let friend = new User(doc);
                User.findOneAndUpdate({_id: uid}, { $addToSet: {friends: email} }, {new: true}, function(err, doc) {
                    if (err) {
                        onErrorQuery(err, res);
                        return;
                    }
                    if (doc) {
                        friend.friends.push(doc.email);
                        friend.save();
                        res.send({status: 'OK', msg: email+' añadido como amigo!'});
                    } else {
                        res.status(403).send({status: 'ERROR', msg: 'Error al añadir amigo'});
                    }
                });
                
            }
        });
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