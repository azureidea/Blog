"use strict";

let mongoose = require('mongoose');
let config = require('../config/config');

var db = mongoose.connect("mongodb://" + config.MongoDB.HOST + ":" + config.MongoDB.PORT + "/" + config.MongoDB.NAME);

module.exports = db;