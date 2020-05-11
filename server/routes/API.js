var express = require('express');
var router = express.Router();

// Imports de los controladores
var user_controller = require('../controllers/UserController');
var event_controller = require('../controllers/EventController');

// --- API User ---

// POST request -> login
router.post('/user/login', user_controller.user_login);

// POST request -> crear usuario
router.post('/user/create', user_controller.user_create_post);

// POST request -> actualizar datos usuario
router.post('/user/update', user_controller.user_update_post);

// POST request -> añadir/eliminar evento favorito
router.post('/user/fav-event', user_controller.user_favourite_events);

// --- API Events ---

// GET request -> obtener eventos disponibles
router.get('/events', event_controller.getEvents);

// POST request -> comprar entradas
router.post('/tickets/buy', event_controller.buyTickets);

// GET request -> obtener eventos favoritos del usuario
router.get('/events/fav', event_controller.getFavEvents);

module.exports = router;