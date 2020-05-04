var Event = require('../models/Event');

exports.getEvents = function(req, res) {
    Event.find({
        starts: {$gt: new Date()}
    }, '-__v', function(err, results) {
        if (err) {
            onErrorQuery();
            return;
        }
        let events = [];
        results.forEach(doc => {
            events.push(new Event(doc).toJSON());
        });
        res.send({status: 'OK', data: events});
    });
}

function onErrorQuery() {
    console.log(err);
    res.status(403).send({status: 'ERROR', msg: 'Error de base de datos, intentalo más tarde.'});
}