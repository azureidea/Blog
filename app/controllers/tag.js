"use strict";
///<reference path="../../typings/node/node.d.ts" />
var util = require('util');

var thunkify = require('thunkify-wrap');

var TagModel = require('../models/tag');

//获取标签列表
exports.list = function * (){
	let tags = yield thunkify(TagModel.find,TagModel)();
	this.send(tags,0);
}

//创建标签
exports.create = function * (){
	var tag = this.request.body;
	
	var result = yield thunkify(TagModel.findByName,TagModel)(tag.name);
	
	if (result) {
		return this.send(result,0);
	}
	
	var tagModel = new TagModel(tag);
	
	result = yield thunkify(tagModel.save,tagModel);
	
	this.send(result[0],0);
}

//链接文章
exports.link = function * (tag,article){
	var result = yield thunkify(TagModel.findByName,TagModel)(tag.name);
	
	var post = {
		id: article._id,
		title: article.title
	};
	
	if (!result) {
		var tagModel = new TagModel(util._extend(tag,{
			articles:[post]
		}));
		
		yield thunkify(tagModel.save,tagModel);
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
	console.log(result.articles);
	yield this.render('tag/index',{
		tag: result
	});
}