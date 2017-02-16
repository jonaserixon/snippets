'use strict';

let mongoose = require("mongoose");


module.exports = {

    initilize : function() {
        // reed db Configuration
        let db = mongoose.connection;

        // mayby should remove out from this file - EventEmitters?
        db.on("error", console.error.bind(console, "connection error:"));

        db.once("open", function() {
            console.log("Succesfully connected to mongoDB");
        });

        // If the Node process ends, close the Mongoose connection.
        process.on("SIGINT", function() {
            db.close(function() {
                console.log("Mongoose connection disconnected through app termination.");
                process.exit(0);
            });
        });

        // Connect to the database.
        mongoose.connect("mongodb://viatrophy:viatrophy@ds135089.mlab.com:35089/viatrophy");
    }



}
