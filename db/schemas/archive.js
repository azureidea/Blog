"use strict";

let mongoose = require('mongoose');

var ArchiveSchema = new mongoose.Schema({
    name: { type: String },
    articles: [{
		id: String,
		title: String
	}],
    ctime: { type: Date, default: Date.now() },
    mtime: { type: Date, default: Date.now() }
});

ArchiveSchema.pre('save', function (next) {
	if (this.isNew) {
		this.ctime = this.mtime = Date.now();
	} else {
		this.mtime = Date.now();
	}
	next && next();
});

ArchiveSchema.statics.findByName = function (name, cb) {
	return this.findOne({ name: name }, cb);
};

ArchiveSchema.statics.findAll = function (cb) {
	return this.find({}, cb);
};

ArchiveSchema.statics.findById = function (id, cb) {
	return this.findOne({ _id: id }, cb);
};

module.exports = ArchiveSchema;
