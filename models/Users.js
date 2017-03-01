'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

userSchema.pre('save', function(next) {
    let user = this;
    bcrypt.genSalt(10, function(err, salt) {
        if(err) { return next(err); }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) { return next(err); }

            user.password = hash;
            next();
        });
    });
});

let User = mongoose.model('users', userSchema);

module.exports = User;
