'use strict';

let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

let User = mongoose.model('Users', userSchema);

module.exports = User;
