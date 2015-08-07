"use strict";

let mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
    name:{type:String}
});

TagSchema.statics = {

};

module.exports = TagSchema;


