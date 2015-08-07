"use strict";

let mongoose = require('mongoose');

let CommentSchema = require('./comment');
let TagSchema = require('./tag')

let Schema = mongoose.Schema;

var ArticleSchema = new mongoose.Schema({
    //comments: [CommentSchema],
    tags: [TagSchema],
    title: { type: String },
    content: { type: String },
    ctime: { type: Date, default: Date.now() },
    mtime:{ type: Date, default: Date.now() }
});

ArticleSchema.pre('save', function(next) {
	if (this.isNew) {
		this.ctime = this.mtime = Date.now();
	} else {
		this.mtime = Date.now();
	}
	next && next();
});

ArticleSchema.statics.fetch = function (cb) {
	return this.find({}, cb);
};

ArticleSchema.statics.findById = function (id, cb) {
	return this.findOne({ _id: id }, cb);
};

module.exports = ArticleSchema;


