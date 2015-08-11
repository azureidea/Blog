"use strict";
///<reference path="../../typings/node/node.d.ts" />
var util = require('util');

var thunkify = require('thunkify-wrap');

var TagModel = require('../models/tag');
var Category = require('./category');

//获取标签列表
exports.list = function * (){
	let tags = yield thunkify(TagModel.find,TagModel)();
	this.send(tags,0);
}

//创建标签
exports.create = function * (){
	var info = this.request.body;
	
	var result = yield thunkify(TagModel.findByName,TagModel)(info.name);
	
	if (result) {
		return this.send(result,0);
	}
	
	var tag = new TagModel(info);
	
	result = yield thunkify(tag.save,tag);
	
	this.send(result[0],0);
}

//链接文章
exports.link = function * (tagInfo,article){
	var result = yield thunkify(TagModel.findByName,TagModel)(tagInfo.name);
	
	var post = {
		id: article._id,
		title: article.title
	};
	
	if (!result) {
		var tag = new TagModel(util._extend(tagInfo,{
			articles:[post]
		}));
		
		yield thunkify(tag.save,tag);
	} else {
		result.articles.push(post);
		
		yield thunkify(result.save,result);
	}
}

/**
 * 分类文章列表页
 */
exports.show = function * (){	
	var tagId = this.params['tagId'];
	
	var result = yield thunkify(TagModel.findById,TagModel)(tagId);
	
	if (!result) {
		return this.send(null,1,"标签不存在");
	}
	
	var category = yield Category.list();
	
	yield this.render('tag/index',{
		title: result.name,
		tag: result,
		category: category
	});
}