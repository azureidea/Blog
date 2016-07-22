"use strict";
var path = require('path');

var koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
var render = require('koa-views');
var staticServer = require('koa-static');
var session = require('koa-generic-session');
var sessionStore = require('koa-session-mongoose');

var config = require('./config/config');
var backendRoutes = require('./app/routes/backend');
var frontendRoutes = require('./app/routes/frontend');
var response = require('./app/middlewares/response');
var db = require('./db/db');

let app = koa();

let backendRouter = new Router({
	prefix: "/api"
});

let frontendRouter = new Router();

app.use(function* (next) {
	console.log(this.url);
	yield next;
});

app.keys = ['koa','blog'];

app.use(session({
    store: sessionStore.create(),
    collection: 'koaSessions',
    connection: db,
    expires: 30 * 60 * 1000,
    model: 'KoaSession'
}));

app.use(staticServer(path.join(__dirname, '/public')))
	.use(render(path.join(__dirname, "./app/views"), { default: 'jade' }))
	.use(response())
	.use(bodyParser())
	.use(backendRouter.routes())
	.use(backendRouter.allowedMethods())
	.use(frontendRouter.routes())
	.use(frontendRouter.allowedMethods());

backendRoutes(backendRouter);
frontendRoutes(frontendRouter);

app.listen(config.PORT);