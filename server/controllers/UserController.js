var User = require('../models/User');

/** Comprueba si los datos enviados por un usuario son válidos para hacer login (POST) */
exports.user_login = function (req, res) {
    // No implementado
    res.send({msg: 'Hola '+req.body.user});
    console.log(req);
    console.log(req.body);
    
}

/** Se encarga de crear un usuario por POST */
exports.user_create_post = function(req, res) {
    res.send('CREATE No implementado');
}

/** Se encarga de actualizar datos de un usuario por POST */
exports.user_update_post = function(req, res) {
    res.send('UPDATE No implementado');
}
