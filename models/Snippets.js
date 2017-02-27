'use strict';

let mongoose = require('mongoose');


let snippetSchema = mongoose.Schema({
    description: {type: String, required: true },
    content: {type: String, required: true },
    language: {type: String, required: false },
    createdBy: {type: String, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: false, }
});

let Snippet = mongoose.model('Snippets', snippetSchema);

module.exports = Snippet;


