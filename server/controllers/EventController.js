var Event = require('../models/Event');
var User = require('../models/User');

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
        let ticket = { event_id: event_id, qty: qty, bought_at: new Date()};
        user.tickets.push(ticket);
        user.save();
        res.send({status: 'OK', msg: qty+' entradas compradas correctamente', ticket: ticket});
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