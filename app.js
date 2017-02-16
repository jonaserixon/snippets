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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/routes.js'));


//Starts web server
app.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});


