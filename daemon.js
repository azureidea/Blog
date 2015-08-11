/*
 *守护进程
 */
var spawn = require ('child_process').spawn;

var logger = require('./lib/logger');

var appLogger = logger.getLogger('app');

var cp;

var heartbeatCollection = {};

var NO_HEARTBEAT_COUNT_LIMIT = 3;

var restartMaster = function () {
    cp = spawn('node',['master.js']);

    var cpid = cp.pid;

    var checkInterval = setInterval(function () {
        if (!heartbeatCollection[cpid]) {
            return clearInterval(checkInterval);
        }
        //主进程收到工作进程发的心跳包后会向守护进程发送消息，守护进程收不到消息就认为主进程死掉了
        if (heartbeatCollection[cpid] > NO_HEARTBEAT_COUNT_LIMIT) {
            appLogger.info("MASTER %d HANGUP", cpid);
            return stopMaster(cp,checkInterval);
        }
        heartbeatCollection[cpid] = (heartbeatCollection[cpid] || 0);
        heartbeatCollection[cpid]++;
    },3000);

    cp.stderr.on('data',function (data) {
        appLogger.error('MASTER %d PROCESS STDERR ERROR: %s', cpid, data);
        stopMaster(cp);
    });

    cp.stdout.on('data',function (data) {
        if (data.toString() === "200") {
            heartbeatCollection[cpid] = 0;
        }
    });

    cp.on('error',function (err) {
        appLogger.error('MASTER %d PROCESS ERROR: %s', cpid, err);
        stopMaster(cp);
    });

    cp.on('exit',function (code) {
        appLogger.info('MASTER %d PROCESS EXIT', cpid);
        stopMaster(cp);
    });

    //process.stdout.write('Start Success');
};

var stopMaster = function (cp,interval) {
    try {
        interval && clearInterval(interval);
        cp.removeAllListeners();
        //delete(cp);
    } catch (err) {
        
    }
    cp.kill();
    restartMaster();
};

restartMaster();

appLogger.info('DAEMON PROCESS %d START', process.pid);

//守护进程退出，主进程退出
process.on('exit',function (code) {
    try {
        cp.kill('SIGINT');
    } catch (err) {
        appLogger.error('KILL MASTER ERROR: %s', err.stack);
    }
});

try {
    ['SIGINT','SIGTERM','SIGHUP','SIGQUIT'].forEach(function (signal) {
        process.on(signal,function () {
            appLogger.info('DAEMON PROCESS %d EXIT', process.pid);
            process.exit(1);
        });
    });
} catch (err) {
    
}

