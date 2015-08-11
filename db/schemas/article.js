"use strict";

let mongoose = require('mongoose');

let CommentSchema = require('./comment');
let TagSchema = require('./tag')

let Schema = mongoose.Schema;

var ArticleSchema = new mongoose.Schema({
    //comments: [CommentSchema],
    tags: [{
		id: String,
		name: String
	}],
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

ArticleSchema.statics.limitQuery = function(count,id,cb) {
	return this.find({'_id' :{ "$gt" :mongoose.Types.ObjectId(id)} }).limit(count).exec(cb);
};

/**
 * 获取近期更新文章列表，默认5条
 */
ArticleSchema.statics.queryRecentArticles = function(count,cb) {
	if (typeof count === "function") {
		cb = count;
		count = 5;
	}
	return this.find({}).limit(count).exec(cb);	
};

module.exports = ArticleSchema;


