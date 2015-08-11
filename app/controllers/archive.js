"use strict";
///<reference path="../../typings/node/node.d.ts" />
var util = require('util');

var thunkify = require('thunkify-wrap');
var moment = require('moment');

var ArchiveModel = require('../models/archive');
var Category = require('./category');

//链接文章
exports.link = function * (article){
	var mtime = article.mtime;
	mtime = new Date(mtime.getFullYear(),mtime.getMonth(),0).getTime();
	
	var result = yield thunkify(ArchiveModel.findByName,ArchiveModel)(mtime);
	
	var post = {
		id: article._id,
		title: article.title
	};
	
	if (!result) {
		var archive = new ArchiveModel({
			name: mtime,
			articles:[post]
		});
		
		yield thunkify(archive.save,archive);
	} else {
		result.articles.push(post);
		
		yield thunkify(result.save,result);
	}
}

/**
 * 归档文章列表页
 */
exports.show = function * (){	
	var archiveId = this.params['archiveId'];
	
	var result = yield thunkify(ArchiveModel.findById,ArchiveModel)(archiveId);
	
	if (!result) {
		return this.send(null,1,"归档不存在");
	}
	
	var category = yield Category.list();
	
	yield this.render('archive/index',{
		title: moment(parseInt(result.name)).format('YYYY年M月'),
		archive: result,
		category: category
	});
}