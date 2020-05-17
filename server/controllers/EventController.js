var Event = require('../models/Event');
var User = require('../models/User');

require('dotenv').config();
var AWS = require('aws-sdk'); 
AWS.config.update({region : process.env.REGION});
s3 = new AWS.S3({apiVersion: '2006-03-01'});

/**
 * Obtiene todos los eventos los cuales su fecha de inicio sea posterior a hoy,
 * para ser exactos todos los posteriores al momento de realizar la petición (GET)
 */
exports.getEvents = function(req, res) {
    Event.find({
        starts: {$gt: new Date()}
    }, '-__v', function(err, results) {
        if (err) {
            onErrorQuery(err, res);
            return;
        }
        let events = [];
        results.forEach(doc => {
            events.push(new Event(doc).toJSON());
        });
        res.send({status: 'OK', data: events});
    });
}

/**
 * Obtiene todos los eventos de un negocio pasando su ID (GET)
 */
exports.getEventsFromBusiness = function(req, res) {
    let id = req.query.id;
    if (isset(id)) {
        Event.find({
            business_id: id
        }, '-__v', function(err, results) {
            if (err) {
                onErrorQuery(err, res);
                return;
            }
            let events = [];
            results.forEach(doc => {
                events.push(new Event(doc).toJSON());
            });
            res.send({status: 'OK', data: events});
        });
    } else {
        res.status(403).send({status: 'ERROR', msg: 'El negocio con el ID: '+id+' no existe'});
    }
}

/**
 * Se encarga de gestionar las compras de entradas (POST)
 */
exports.buyTickets = function(req, res) {
    let event_id = req.body.event_id, qty = parseInt(req.body.qty), uid = req.body.uid, user;
    // Log para ver datos en la consola
    console.log('[INFO] Buy tickets REQ at '+new Date()+' -> { event_id: "'+event_id+'", qty: "'+qty+'", uid: "'+uid+'" }');

    if (isset(event_id) && (isset(qty) && !isNaN(qty)) && isset(uid)) {
        User.findById(uid, function(err, doc) {
            if (err) {
                onErrorQuery(err, res);
                return;
            }
            if (doc) {
                user = new User(doc);
                if (!isset(user.credit_card)) {
                    if (isset(req.body.number) && isset(req.body.expires) && isset(req.body.ccv) && isset(req.body.nameOnCard)) {
                        user.credit_card = { number: req.body.number, expires: req.body.expires, ccv: req.body.ccv, nameOnCard: req.body.nameOnCard };
                    } else {
                        res.status(403).send({status: 'ERROR', msg: 'Debes añadir una tarjeta de crédito para poder comprar entradas'});
                        return;
                    }
                }
                Event.updateOne({_id: event_id, tickets_available: {$gte: 0}}, { $inc: { tickets_available: -qty } }, callback_update_event);
            } else {
                res.status(403).send({status: 'ERROR', msg: 'Faltan datos o hay un error, vuelve a intentarlo'});
            }
        });
    } else {
        res.status(403).send({status: 'ERROR', msg: 'Faltan datos o hay un error, vuelve a intentarlo'});
    }


    function callback_update_event(err, raw) {
        if (err) {
            onErrorQuery(err, res);
            return;
        }
        if (raw.nModified < 1) {
            res.status(403).send({status: 'ERROR', msg: 'Error al comprar las entradas'});
            return;
        }
        let code = 'PF-'+parseInt(Date.now() + Math.random());
        let ticket = { ticket_code: code, event_id: event_id, qty: qty, bought_at: new Date()};
        user.tickets.push(ticket);
        user.save();
        ticket.bought_at = Event.formatDate(ticket.bought_at);
        res.send({status: 'OK', msg: qty+' entradas compradas correctamente', ticket: ticket});
    }
}

/**
 * Obtiene los eventos favoritos de un usuario
 */
exports.getFavEvents = function(req, res) {
    let uid = req.body.uid;
    if (isset(uid)) {
        User.findOne({_id: uid}, 'fav_events', function(err, doc) {
            if (err) {
                onErrorQuery(err, res);
                return;
            }
            if (doc) {
                if (doc.fav_events.length > 0) {
                    Event.find({
                        _id: {$in: doc.fav_events}
                    }, '-__v', function(err, results) {
                        if (err) {
                            onErrorQuery(err, res);
                            return;
                        }
                        let events = [];
                        results.forEach(doc => {
                            events.push(new Event(doc).toJSON());
                        });
                        res.send({status: 'OK', data: events});
                    });
                } else {
                    res.send({status: 'OK', msg: 'No hay eventos en favoritos', data: []});
                }
            } else {
                res.status(403).send({status: 'ERROR', msg: 'Ha habido un error al obtener los eventos favoritos'});
            }
        });
    } else {
        res.status(403).send({status: 'ERROR', msg: 'Ha habido un error al obtener los eventos favoritos'});
    }
}

exports.createEvent = function(req, res) {
    console.log('[INFO] Event creation REQ at '+new Date());
    let event = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        starts: req.body.starts,
        ends: req.body.ends, 
        location: req.body.location,
        ticketsForSale: req.body.ticketsForSale,
        business_id: req.body.business_id
    }

    if (isset(event.name) && isset(event.description) && isset(event.price) && isset(event.starts) && isset(event.ends) && isset(event.location) && isset(event.ticketsForSale) && isset(event.business_id)) {
        let mEvent = new Event(event);
        mEvent.tickets_available = mEvent.ticketsForSale;
        // Si el usuario ha subido una imagen la guardamos
        let msg = 'Evento creado correctamente!';
        let img = req.body.image;
        if (isset(img)) {
            const base64 = new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            console.log('Image? '+isset(base64));
            if (isset(base64)) {
                const type = new String(img).split(';')[0].split('/')[1];
                var uploadParams = {
                    Bucket: process.env.BUCKET,
                    Key: 'img-'+Date.now()+'.'+type,
                    Body: base64,
                    ContentEncoding: 'base64',
                    ContentType: 'image/'+type
                };
                s3.upload (uploadParams, function (err, data) {
                    if (err) {
                        console.log('Error', err);
                        mEvent.save();
                        res.send({status: 'OK', msg: msg + ' La imagen no se ha podido guardar.',});
                    }
                    if (data) {
                        console.log('[INFO] Image uploaded successfully:', data.Location);
                        mEvent.img_url = data.Location;
                        mEvent.save(function (err) {
                            if (err) {
                                onErrorQuery(err, res);
                                return;
                            }
                            res.send({status: 'OK', msg: msg});
                        });
                    }
                });
            }
        } else {
            mEvent.save();
            res.send({status: 'OK', msg: msg});
        }
    } else {
        res.status(403).send({status: 'ERROR', msg: 'Faltan poder crear el evento. Vuelve a intentarlo'});
    }
}


function onErrorQuery(err, res) {
    console.log(err);
    res.status(403).send({status: 'ERROR', msg: 'Error de base de datos, intentalo más tarde.'});
}

function isset(value) {
    if (value !== undefined && value != null && value != '') {
        return true;
    }
    return false;
}