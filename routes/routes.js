'use strict';

let router = require("express").Router();
let User = require('../models/Users');

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

router.route('/createUser')
    .post(function (req, res) {
        let userObject = new User({
            username: req.body.userReg,
            password: req.body.passReg
        });

        userObject.save(function (error) {
            if(error) {
                return console.log(error);
            }
            console.log('funkar');
            res.redirect('/');
        });
    });


module.exports = router;
