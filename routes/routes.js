'use strict';

let router = require("express").Router();
let User = require('../models/Users');
let Snippet = require('../models/Snippets');
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');


//Routes -----------------------------------------------------
router.route('/')
    .get(function (req, res) {
        res.redirect('/snippets');
    });

/**
 * Login with user inputs and comparing hashed password
 */
router.route('/login')
    .get(function (req, res) {
        res.render('users/login');
    })
    .post(function (req, res) {
        let username = req.body.username;
        let password = req.body.password;

        //Finds username and compares the passwords.
        User.findOne({ username: username }).exec()
            .then((user) => {
                if (user) {
                    bcrypt.compare(password, user.password, (err, result) =>  {
                        if(err) {
                            return console.log(err);
                        }
                        if(result) {
                            req.session.user = user;
                            res.redirect('/snippets');
                        }
                    });
                } else {
                    req.session.flash = {
                        type: 'fail',
                        message: 'Username or password is invalid!'
                    };
                    return res.redirect('/login');
                }
            })
            .catch()
    });


/**
 * Logout user and destroy session
 */
router.route('/logout')
    .get(function (req, res) {
        res.render('users/logout');
    })
    .post(function (req, res) {
        req.session.destroy();
        res.redirect('/snippets');
    });


/**
 * Create a new user
 */
router.route('/register')
    .get(function (req, res) {
        res.render('users/register');
    })
    .post(function (req, res) {

        let userReg = req.body.userReg;

        User.findOne({ username: userReg}).exec()       //Checks if username already exists in database.
            .then(function (user) {
                if (user) {
                    req.session.flash = {
                        type: 'fail',
                        message: 'Username already taken!'
                    };
                    return res.redirect('/register');
                } else {
                    let userObject = new User({
                        username: req.body.userReg,
                        password: req.body.passReg
                    });

                    /**
                     * Validating user inputs
                     */
                    if(userObject.username.length < 3) {
                        req.session.flash = {
                            type: 'fail',
                            message: 'Username needs to be at least 3 characters, dude!'
                        };
                        return res.redirect('/register');
                    }

                    if(userObject.password.length < 4) {
                        req.session.flash = {
                            type: 'fail',
                            message: 'Password needs to be at least 4 characters!'
                        };
                        return res.redirect('/register');
                    }

                    userObject.save(function () {
                        res.redirect('/login');
                    });
                }
            });
    });

/**
 * Creating and validating user inputs on a Snippet
 */
router.route('/createSnippet')
    .get(function (req, res) {
        if(res.locals.user) {
            res.render('snippets/createSnippet');
        } else {
            res.render('errors/403');
        }

    })
    .post(function (req, res) {
        let snippetObject = new Snippet({
            description: req.body.snippetDesc,
            content: req.body.snippetCont,
            createdBy: res.locals.user.username,
            language: req.body.codeLanguage
        });

        /**
         * Validating user inputs
         */
        if(snippetObject.description === '') {
            req.session.flash = {
                type: 'fail',
                message: 'You totally forgot the title, LOL!'
            };
            return res.redirect('/createSnippet');
        }

        if(snippetObject.language === undefined) {
            req.session.flash = {
                type: 'fail',
                message: 'Please select your code language...!!'
            };
            return res.redirect('/createSnippet');
        }

        if(snippetObject.content === '') {
            req.session.flash = {
                type: 'fail',
                message: 'You forgot to write some code, stupid!'
            };
            return res.redirect('/createSnippet');
        }

        snippetObject.save(function (error) {
            if(error) {
                console.log(error);
            }
            res.redirect('/snippets');
        });
    });


/**
 * Renders the home view
 */
router.route('/snippets')
    .get(function (req, res) {
        Snippet.find({  }).sort({createdAt: 'desc'}).exec()
            .then (function(doc) {
                res.render('home',{snippet: doc});
            });
    });

/**
 * Delete specific snippet
 */
router.route('/delete/:id')
    .get(function (req, res) {
        if(res.locals.user) {
            Snippet.findOne({_id: req.params.id}).exec()
                .then(function (doc) {
                    res.render('snippets/delete', {snippet: doc});
                });
        } else {
            res.render('errors/403');
        }
    })
    .post(function (req, res) {
        Snippet.findOneAndRemove({ _id: req.params.id }).exec()
            .then (function () {
                res.redirect('/snippets');
            });
    });

/**
 * Update specific snippet
 */
router.route('/update/:id')
    .get(function (req, res) {
        if(res.locals.user) {
            Snippet.findOne({ _id: req.params.id }).exec()
                .then (function(doc) {
                    res.render('snippets/update',{snippet: doc});
                });
        } else {
            res.render('errors/403');
        }
    })
    .post(function (req, res) {

        let updateSnippet = {
            description: req.body.snippetDesc,
            content: req.body.snippetCont,
            language: req.body.codeLanguage,
            updatedAt: Date.now()
        };

        Snippet.findOneAndUpdate({ _id: req.params.id }, { $set: updateSnippet}).exec()
            .then (function () {
                res.redirect('/snippets');
            });
    });

/**
 * View specific snippet
 */
router.route('/snippet/:id')
    .get(function (req, res) {
        Snippet.findOne({ _id: req.params.id }).exec()
            .then (function(doc) {
                res.render('snippets/viewSnippet',{snippet: doc});
            });
    })
    .post(function (req, res) {
        Snippet.findOneAndRemove({_id: req.params.id}).exec()
            .then(function () {
                res.redirect('/snippets');
            });
    });

module.exports = router;
