var User = require('../models/User');

/** Comprueba si los datos enviados por un usuario son válidos para hacer login (POST) */
exports.user_login = function (req, res) {
    let email = req.body.email;
    let pass = req.body.password;
    // Log para ver en consola los datos
    console.log('[INFO] Request at '+new Date()+' -> { email: "'+email+'", pass: "'+pass+'" }');
    
    if (isset(email) && isset(pass)) {
        User.findOne({email: email, password: pass}, '-_id -__v -credit_card', function(err, document) {
            if (err) {
                console.log(err);
                res.send({status: 'ERROR', msg: 'Error de base de datos, intentalo más tarde.'});
                return;
            }
            if (isset(document)) {
                var user = new User(document);
                res.send({status: 'OK', msg: 'Bienvenido '+user.name+'!', data: user.toJSON()});
            } else {
                res.send({status: 'ERROR', msg: 'E-Mail/Contraseña inválidos'});
            }
        });
    } else {
        res.send({status: 'ERROR', msg: 'E-Mail/Contraseña inválidos'});
    }
}

/** Se encarga de crear un usuario por POST */
exports.user_create_post = function(req, res) {
    res.send('CREATE No implementado');
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