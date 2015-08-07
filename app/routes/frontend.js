"use strict";

var User = require('../controllers/user');
var Article = require('../controllers/article');

module.exports = function (router) {
	
	//首页，和文章列表页的内容相同
	router.get('/',Article.index);
	
	//获取文章列表
	router.get('/articles',Article.index);			
	
	//查询访问详情
	router.get('/article/:articleId',Article.show);
	
}