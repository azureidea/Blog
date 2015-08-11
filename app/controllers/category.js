"use strict";
///<reference path="../../typings/node/node.d.ts" />
var util = require('util');

var thunkify = require('thunkify-wrap');
var moment = require('moment');

var TagModel = require('../models/tag');
var ArticleModel = require('../models/article');
var ArchiveModel = require('../models/archive');

//获取标签列表
exports.list = function* () {
	var tags = yield thunkify(TagModel.find, TagModel)();
	var recentArticles = yield thunkify(ArticleModel.queryRecentArticles, ArticleModel)();
	var archives = yield thunkify(ArchiveModel.findAll, ArchiveModel)();
	
	archives = archives.map(function(archive){
		archive.name = moment(parseInt(archive.name)).format('YYYY年M月');
		return archive;
	});
	
	return yield {
		tags: tags,
		archives: archives,
		recent: recentArticles
	};
}
