"use strict";
///<reference path="../../typings/node/node.d.ts" />
var thunkify = require('thunkify-wrap');

var UserModel = require('../models/user');
var $ = require('../../lib/util');

//获取用户列表
exports.list = function * (){
	let users = yield thunkify(UserModel.find,UserModel)();
	this.send(users,0);
}

//创建用户
exports.create = function * (){
	var info = this.request.body;
	
	var result = yield thunkify(UserModel.findByName,UserModel)(info.email);
	
	if (result) {
		return this.send(null,1,"用户已存在");
	}
	
	info.password = $.getMd5(info.password);
	
	var user = new UserModel(info);
	
	yield thunkify(user.save,user);
	
	this.redirect('/admin/login.html');
}

//删除用户
exports.remove = function * (){
	var user = this.request.body;
	
	var result = yield thunkify(UserModel.findById,UserModel)(user.id);
	
	if (!result) {
		return this.send(null,1,"用户不存在");
	}	
	
	yield thunkify(result.remove,result)();
	
	this.send(null,0);
}

//更新用户信息
exports.update = function * (){
	var user = this.request.body;
	
	var result = yield thunkify(UserModel.findById,UserModel)(user.id);
	
	if (!result) {
		return this.send(null,1,"用户不存在");
	}	
	
	yield thunkify(result.update,result)({
		account: user.account,
		password: user.password
	});
	
	this.send(null,0);
}

//查询用户信息
exports.fetch = function * (){
	var userId = this.params['userId'];
	
	var result = yield thunkify(UserModel.findById,UserModel)(userId);
	
	if (!result) {
		return this.send(null,1,"用户不存在");
	}	
	
	this.send(result,0);
}

//登录
exports.login = function *(){
	var user = this.request.body;
	var result = yield thunkify(UserModel.findByName,UserModel)(user.email);
	
	if (!result) {
		this.send(null,1,"用户不存在");
		return;
	}
	
	if (result.password !== $.getMd5(user.password)) {
		this.send(null,1,"密码不正确");
		return;
	}
	
	this.session.user = user;
	
	this.redirect('/admin/');
}