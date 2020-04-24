var express = require('express');
var router = express.Router();

// Imports de los controladores
var user_controller = require('../controllers/UserController');

// --- API User ---

// POST request -> login
router.post('/user/login', user_controller.user_login);

// POST request -> crear usuario
router.post('/user/create', user_controller.user_create_post);

// POST request -> actualizar datos usuario
router.post('/user/update', user_controller.user_update_post);


module.exports = router;