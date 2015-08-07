"use strict";

var User = require('../controllers/user');
var Article = require('../controllers/article');

module.exports = function (router) {
	
	//获取用户列表
	router.get('/users',User.list);
	
	//查询用户详情
	router.get('/user/:userId',User.fetch);
	
	//创建用户
	router.post('/user/create',User.create);
	
	//删除用户
	router.post('/user/delete',User.remove);
	
	//更新用户
	router.post('/user/update',User.update);
	
	//获取文章列表
	router.get('/articles',Article.list);
	
	//创建文章
	router.post('/article/create',Article.create);
		
	//更新文章
	router.post('/article/update/:articleId',Article.update);
	
	//删除文章
	router.post('/article/delete/:articleId',Article.remove);
	
	//查询访问详情
	router.get('/article/:articleId',Article.fetch);
}