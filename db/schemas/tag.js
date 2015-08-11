"use strict";

let mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
    name: { type: String },
    articles: [{
		id: String,
		title: String
	}],
    ctime: { type: Date, default: Date.now() },
    mtime: { type: Date, default: Date.now() }
});

TagSchema.pre('save', function (next) {
	if (this.isNew) {
		this.ctime = this.mtime = Date.now();
	} else {
		this.mtime = Date.now();
	}
	next && next();
});

TagSchema.statics.findByName = function (name, cb) {
	return this.findOne({ name: name }, cb);
};

TagSchema.statics.findById = function (id, cb) {
	return this.findOne({ _id: id }, cb);
};

module.exports = TagSchema;


