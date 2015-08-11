"use strict";
///<reference path="../../typings/node/node.d.ts" />
var util = require('util');
var fs = require('fs');
var path = require('path');

var thunkify = require('thunkify-wrap');
var marked = require('marked');
var hljs = require('highlight.js');

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
 * 关于我页面
 */
exports.show = function * (){		
	var result = yield thunkify(fs.readFile,fs)(path.join(__dirname,"../../config/me.md"));
	
	yield this.render('about/index',{
		title: "关于我",
		content: marked(result.toString())
	});
}