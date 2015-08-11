"use strict";

let mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    content:{type:String},
    author:{type:String}
});

CommentSchema.statics = {

};

module.exports = CommentSchema;


