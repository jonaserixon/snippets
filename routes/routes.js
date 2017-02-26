'use strict';

let router = require("express").Router();
let User = require('../models/Users');
let Snippet = require('../models/Snippets');
let mongoose = require('mongoose');


//Routes ------------------------------------------------->

router.route('/')
    .get(function (req, res) {
        res.render('home');
    });


router.route('/login')
    .get(function (req, res) {
        res.render('login');
    })
    .post(function (req, res) {
        let username = req.body.username;
        let password = req.body.password;
        User.findOne({ username: username, password: password}).exec()
            .then(function (user) {
                if (user) {
                    req.session.user = user;
                }
                res.render('home', {userLogin: req.session.user.username});
            })
    });


router.route('/logout')
    .get(function (req, res) {
        res.render('logout');
    })
    .post(function (req, res) {
        req.session.destroy();
        res.redirect('/snippets');
    });


router.route('/createUser')
    .get(function (req, res) {
        res.render('createUser');
    })
    .post(function (req, res) {

        let userReg = req.body.userReg;

        User.findOne({ username: userReg}).exec()
            .then(function (user) {
                if (user) {
                    return res.render('createUser');
                } else {
                    let userObject = new User({
                        username: req.body.userReg,
                        password: req.body.passReg
                    });
                    userObject.save(function (error) {
                        res.redirect('/');
                    });
                }
            });
    });


router.route('/createSnippet')
    .get(function (req, res) {
        if(res.locals.user) {
            res.render('createSnippet');
        } else {
            res.render('403');
        }

    })
    .post(function (req, res) {
        let snippetObject = new Snippet({
            description: req.body.snippetDesc,
            content: req.body.snippetCont
        });
        snippetObject.save(function (error) {
            if(error) {
                console.log(error);
            }
            res.redirect('/snippets');
        });
    });


router.route('/snippets')
    .get(function (req, res) {
        Snippet.find({  }).sort({createdAt: 'desc'}).exec()
            .then (function(doc) {
                res.render('home',{snippet: doc});
            });
    });


router.route('/delete/:id')
    .get(function (req, res) {
        if(res.locals.user) {
            Snippet.findOne({_id: req.params.id}).exec()
                .then(function (doc) {
                    res.render('delete', {snippet: doc});
                });
        } else {
            res.render('403');
        }
    })
    .post(function (req, res) {
        Snippet.findOneAndRemove({ _id: req.params.id }).exec()
            .then (function () {
                res.redirect('/snippets');
            });
    });


router.route('/update/:id')
    .get(function (req, res) {
        if(res.locals.user) {
            Snippet.findOne({ _id: req.params.id }).exec()
                .then (function(doc) {
                    res.render('update',{snippet: doc});
                });
        } else {
            res.render('403');
        }
    })
    .post(function (req, res) {

        let updateSnippet = {
            description: req.body.snippetDesc,
            content: req.body.snippetCont,
            updatedAt: Date.now()
        };

        Snippet.findOneAndUpdate({ _id: req.params.id }, { $set: updateSnippet}).exec()
            .then (function () {
                res.redirect('/snippets');
            });
    });


router.route('/viewSnippet/:id')
    .get(function (req, res) {
        Snippet.findOne({ _id: req.params.id }).exec()
            .then (function(doc) {
                res.render('viewSnippet',{snippet: doc});
            });
    })
    .post(function (req, res) {
        Snippet.findOneAndRemove({_id: req.params.id}).exec()
            .then(function () {
                res.redirect('/snippets');
            });
    });




module.exports = router;
