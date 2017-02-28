'use strict';

let express = require('express');
let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let session = require('express-session');
let path = require('path');


let app = express();
let port = process.env.PORT || 8000;


app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


//database
require('./config/database').initilize();


//the req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Static files
app.use(express.static(path.join(__dirname, 'public')));


//Session
app.use(session({
    name: 'theserversession',
    secret: 'hemligt',
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 *24
    }
}));

//Flash
app.use(function (req, res, next) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;

    next();
});


app.use(function(req, res, next) {
    res.locals.user = req.session.user;

    next();
});


//Routes
app.use('/', require('./routes/routes.js'));


//catch all 404 & 500
app.use(function (request, response) {
    response.status(404).render('errors/404');
});

app.use(function (request, response) {
    response.status(500).render('errors/500');
});


//Starts web server
app.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});


