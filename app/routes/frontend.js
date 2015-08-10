"use strict";

var User = require('../controllers/user');
var Article = require('../controllers/article');
var Tag = require('../controllers/tag');

module.exports = function (router) {
	
	//首页，和文章列表页的内容相同
	router.get('/',Article.index);
	
	//获取文章列表
	router.get('/articles',Article.index);			
	
	//查询文章详情
	router.get('/article/:articleId',Article.show);
	
	//获取分类文章列表
	router.get('/tag/:tagId',Tag.show);
}