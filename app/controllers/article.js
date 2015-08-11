"use strict";
///<reference path="../../typings/node/node.d.ts" />
var util = require('util');

var marked = require('marked');
var hljs = require('highlight.js');
var thunkify = require('thunkify-wrap');

var ArticleModel = require('../models/article');
var Tag = require('./tag');
var Archive = require('./Archive');
var Category = require('./category');

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false,
	highlight: function (code) {
    	return hljs.highlightAuto(code).value;
  	}
});

/**
 * 获取文章列表
 */
exports.list = function *(){
	var articles = yield thunkify(ArticleModel.find,ArticleModel)();
	
	this.send(articles,0);
}

/**
 * 新增文章
 */
exports.create = function *(){
	var info = this.request.body;
	
	var article = new ArticleModel(info);
	
	var result = yield thunkify(article.save,article);
	
	if (!result) {
		return this.send(null,1,"创建文章失败");
	}
	
	//创建文章和标签链接关系
	yield info.tags.map(function(tag){
		return Tag.link(tag,result[0]);
	});
	
	//创建文章和归档链接关系
	yield Archive.link(result[0]);
	
	this.send(null,0);
}

/**
 * 更新文章
 */
exports.update = function *(){	
	var articleId = this.params['articleId'];
	
	var result = yield thunkify(ArticleModel.findById,ArticleModel)(articleId);
	
	if (!result) {
		return this.send(null,1,"文章不存在");
	}	
	
	//todo
	util._extend(result,this.request.body);
	
	result = yield thunkify(result.save,result);
	
	if (!result) {
		return this.send(null,1,"更新失败");
	}
	
	//todo tag link
	this.send(null,0);
}

/**
 * 删除文章
 */
exports.remove = function *(){
	var articleId = this.params['articleId'];
	
	var result = yield thunkify(ArticleModel.findById,ArticleModel)(articleId);
	
	if (!result) {
		return this.send(null,1,"文章不存在");
	}	
	
	result = yield thunkify(result.remove,result);
	
	if (!result) {
		return this.send(null,1,"删除失败");
	}
	
	this.send(null,0);
}

/**
 * 获取文章详情
 */
exports.fetch = function *(){
	var articleId = this.params['articleId'];
	
	var result = yield thunkify(ArticleModel.findById,ArticleModel)(articleId);
	
	if (!result) {
		return this.send(null,1,"文章不存在");
	}	
	
	//多传一个raw参数且为1表示返回md内容，编辑场景下使用
	if (this.query.raw !== "1") {		
		result.content = marked(result.content);
	}
	
	this.send(result,0);
}

/**
 * 文章列表页
 */
exports.index = function *(){
	var articles = yield thunkify(ArticleModel.find, ArticleModel)();

	articles.forEach(function(article){
		//截取文章内容，按\n分割，最多取5段
		var items = article.content.split('\n');
		items.splice(Math.max(1,Math.min(5,items.length)))
		items.push('...');
		
		var content = marked(items.join(" "));
		
		article.content = content;
	});
	
	var category = yield Category.list();
	
	yield this.render('article/index', {
		title: "首页",
		articles: articles,
		category: category
	});
}

/**
 * 文章详情页
 */
exports.show = function *(){
	var articleId = this.params['articleId'];
	
	var result = yield thunkify(ArticleModel.findById,ArticleModel)(articleId);
	
	if (!result) {
		yield this.render('404.jade');
		return;
	}
	
	result.content = marked(result.content);
	
	var category = yield Category.list();
	
	yield this.render('article/show', {
		title: result.title,
		article: result,
		category: category
	});
}