/*
 *工作进程
 */
var cluster = require('cluster');

var logger = require('./lib/logger');
var config = require('./config/config');
var server = require('./app');

var appLogger = logger.getLogger('app');

var closeServer = function (server) {
    try {
        process.send({ act: "suicide" });
        //处理完当前请求后退出进程
        server.close(function () {
            process.exit(1);
        });
        
        if (cluster.worker) {
			cluster.work.disconnect();
		}
    } catch (err) {
        appLogger.error('CLOSE WORKER SERVER ERROR: %s, PROCESS ID: %d', err.stack, process.pid);
    }

    //5s后未处理完也退出进程
    var timer = setTimeout(function () {
        process.exit(1);
    },5000);
    
    timer.unref();
};

process.on('message',function (message) {
    if (message && message.act){
        var command = message.act;
        if(command === "suicide") {
            appLogger.info('SERVER READY TO SUICIDE, PROCESS ID: %d',process.pid);
            return closeServer(server);
        }
        if (command === "heartbeat") {
            return process.send({act:'heartbeat',content:"200"});
        }
    }  
});

server.listen(config.SERVER_PORT,function () {
    appLogger.info("SERVER IS RUNNING , LISTENING AT %s",config.SERVER_PORT);

    process.on('uncaughtException',function (err) {
        appLogger.info('UNCAUGHT SERVER ERROR: %s, PROCESS ID: %d', err.stack, process.pid);
        closeServer(server);
    });
});
