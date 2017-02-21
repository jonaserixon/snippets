'use strict';

let router = require("express").Router();
let User = require('../models/Users');
let Snippet = require('../models/Snippets');
let mongoose = require('mongoose');


//Routes ------------------------------------------------->

router.route('/')
    .get(function (req, res) {
        res.render("home");
    });


router.route('/login')
    .get(function (req, res) {
        res.render('login');
    })
    .post(function (req, res) {
        res.redirect('/');
    });


router.route('/createUser')
    .get(function (req, res) {
        res.render('createUser');
    })
    .post(function (req, res) {
        let userObject = new User({
            username: req.body.userReg,
            password: req.body.passReg
        });
        userObject.save(function (error) {
            if(error) {
                console.log(error);
            }
            res.redirect('/');
        });
    });


router.route('/createSnippet')
    .get(function (req, res) {
        res.render('createSnippet');
    })
    .post(function (req, res) {
        let snippetObject = new Snippet({
            description: req.body.snippetDesc,
            content: req.body.snippetCont
        });
        snippetObject.save(function (error) {
            if(error) {
            }
            res.redirect('/snippets');
        });
    });


router.route('/snippets')
    .get(function (req, res) {
        Snippet.find({}).exec()
            .then (function(doc) {
                res.render("home",{snippet: doc});
            });
    });


router.route('/delete/:id')
    .get(function (req, res) {
        Snippet.findOne({ _id: req.params.id }).exec()
            .then (function(doc) {
                console.log(doc);
                res.render("delete",{hej: doc});
            });
    })
    .post(function (req, res) {
        Snippet.findOneAndRemove({ _id: req.params.id }).exec()
            .then (function () {
                res.redirect('/snippets');
            });
    });


router.route('/update/:id')
    .get(function (req, res) {
        Snippet.findOne({ _id: req.params.id }).exec()
            .then (function(doc) {
                console.log(doc);
                res.render("update",{hej: doc});
            });
    })
    .post(function (req, res) {
        let updateSnippet = {
            description: req.body.snippetDesc,
            content: req.body.snippetCont
        };

        Snippet.findOneAndUpdate({ _id: req.params.id }, { $set: updateSnippet}).exec()
            .then (function () {
                res.redirect('/snippets');
            });
    });


module.exports = router;
