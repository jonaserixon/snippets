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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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


app.use(function(req, res, next) {
    res.locals.user = req.session.user;

    next();
});


//Routes
app.use('/', require('./routes/routes.js'));


//catch all 404
app.use(function (request, response) {
    response.status(404).render('404');
});


app.use(function (err, req, res) {
    response.status(403).render('403');
});


//Starts web server
app.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});


