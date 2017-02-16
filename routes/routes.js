'use strict';

let router = require("express").Router();

router.route('/')
    .get(function (req, res) {
        res.render('home');
    });


router.route('/login')
    .get(function (req, res) {
        res.render('login');
    })
    .post(function (req, res) {
        res.redirect('/');
    });


module.exports = router;
