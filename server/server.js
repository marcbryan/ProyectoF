const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

var apiRouter = require('./routes/API');
app.use('/api', apiRouter);

// Variables entorno
const PORT = process.env.PORT || 3000;
var host = process.env.HOST;
var db_name = process.env.DBNAME;

var URI = 'mongodb+srv://'+host+'/'+db_name+'?retryWrites=true&w=majority';

const mongoose = require('mongoose');
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.DBUSER,
    pass: process.env.DBPASS
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
    // Connected succesfully
    app.listen(PORT, function() {
        console.log('Example app listening on port '+PORT);
    });
});
