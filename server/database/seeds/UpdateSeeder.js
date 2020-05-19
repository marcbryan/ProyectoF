'use strict';
const faker = require('faker');

const mongoose = require('mongoose');
const Business = mongoose.model('Business')
const Event = mongoose.model('Event');
const BusinessUser = mongoose.model('BusinessUser');

var update = (callback) => {
    let data = { events: [], users: []};
    // Buscamos los IDs de los negocios para actualizar los business_id de Events y BusinessUser generados por el seeder
    Business.find({}, '_id').exec(function(err, results) {
        if (err) throw 'Connection error: ' + err;
        var ids = [];
        results.forEach(doc => ids.push(doc._id));        
        if (ids.length > 0) {
            Event.find({business_id: null}, function(err, results) {
                if (err) throw 'Connection error: ' + err;
                if (results.length > 0) {
                    results.forEach(doc => {
                        let ev = new Event(doc);
                        ev.business_id = faker.random.arrayElement(ids);
                        data.events.push(ev);
                    });
                }
                BusinessUser.find({business_id: null}, function(err, results) {
                    if (err) throw 'Connection error: ' + err;
                    if (results.length > 0) {
                        results.forEach((doc, key, arr) => {
                            let user = new BusinessUser(doc);
                            user.business_id = faker.random.arrayElement(ids);
                            data.users.push(user);
                        });
                        console.log('Updating events and business users...');
                        // Guardamos los cambios
                        Event.create(data.events, (err, result) => {
                            if (err) throw err;
                            BusinessUser.create(data.users, (err, result) => {
                                if (err) throw err;
                                callback();
                            });
                        });
                    }
                });
            });
        }
    });
}

module.exports = update;

