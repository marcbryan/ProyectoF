const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors());
// Para que se pueda acceder a la carpeta public
app.use(express.static('public'));

var apiRouter = require('./routes/API');
app.use('/api', apiRouter);

// Documentación
app.get('/', function(req, res) {
  res.render('api-docs');
});

// Variables entorno
const PORT = process.env.PORT || 3000;
var host = process.env.HOST;
var db_name = process.env.DBNAME;

var URI = 'mongodb+srv://'+host+'/'+db_name+'?retryWrites=true&w=majority';

const mongoose = require('mongoose');
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    user: process.env.DBUSER,
    pass: process.env.DBPASS
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
    // Connected succesfully
    app.listen(PORT, function() {
        console.log('Server listening on port '+PORT);
    });
});
