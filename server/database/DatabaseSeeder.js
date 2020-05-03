'use strict';
require('dotenv').config();

// Imports modelos
require('../models/User');
require('../models/Event');

// Variables entorno
var host = process.env.HOST;
var db_name = process.env.DBNAME;

var seeds = [
    require('./seeds/UsersSeeder.js'),
    require('./seeds/EventsSeeder.js')
    // TODO: Añadir los otros seeders
];
var seedsDone = 0;

var URI = 'mongodb+srv://'+host+'/'+db_name+'?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.DBUSER,
    pass: process.env.DBPASS
}, (err, res) => {
    if (err) throw 'Connection error: ' + err;
    console.log('Connected succesfully!!');
    //mongoose.connection.db.dropDatabase();
    seeds.forEach((seed) => {
        seed(next);
    });
});

var next = () => {
    seedsDone++;
    if (seedsDone === seeds.length) {
        mongoose.connection.close(function () {
            console.log(`Seeding Completed! (${seedsDone} seeds)`);
        });
    }
};