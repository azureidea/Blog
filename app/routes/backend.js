"use strict";

var User = require('../controllers/user');
var Article = require('../controllers/article');
var Tag = require('../controllers/tag');

var Auth = require('../middlewares/auth');

module.exports = function (router) {
	
	//用户登录
	router.post('/login', User.login);
	
	//用户注册
	router.post('/register', User.create);
	
	//获取用户列表
	router.get('/users', Auth(), User.list);
	
	//查询用户详情
	router.get('/user/:userId', Auth(), User.fetch);
	
	//创建用户
	router.post('/user/create', Auth(), User.create);
	
	//删除用户
	router.post('/user/delete', Auth(), User.remove);
	
	//更新用户
	router.post('/user/update', Auth(), User.update);
	
	//获取文章列表
	router.get('/articles', Auth(), Article.list);
	
	//创建文章
	router.post('/article/create', Auth(), Article.create);
		
	//更新文章
	router.post('/article/update/:articleId', Auth(), Article.update);
	
	//删除文章
	router.post('/article/delete/:articleId', Auth(), Article.remove);
	
	//查询文章详情
	router.get('/article/:articleId', Auth(), Article.fetch);
	
	//获取标签列表
	router.get('/tags', Auth(), Tag.list);
	
	//创建标签
	router.post('/tag/create', Auth(), Tag.create);
}