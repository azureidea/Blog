/*
 *主进程 
 */
var cluster = require('cluster');
var os = require('os');

var logger = require('./lib/logger');

var cpus = os.cpus();
var appLogger = logger.getLogger('app');

var debuggerMode = false;

debuggerMode && ['error','info'].forEach(function (type) {
    appLogger[type] = function () {
        console[type].apply(console,arguments);
    };
});

cluster.setupMaster({
	exec: "worker.js"
});

var workers = {};
var workerIds = {};
var heartbeatCollection = {};

var NO_HEARTBEAT_COUNT_LIMIT = 3;
var during = 6000;
var restart = [];
var limit = 10;

//判断是否短期频繁重启
var isTooFrequently = function () {
    var time = Date.now();
    restart.push(time);

    if (restart.length > limit * cpus.length) {
        restart.shift();
    }
    return (restart.length >= limit * cpus.length) && (restart[restart.length - 1] - restart[0] < during);
};

//创建工作进程
var createWorker = function() {
    //重启次数超过限制，主进程退出
    if (isTooFrequently()) {
        appLogger.error('MASTER %d RESTART FREQUENTLY, READY TO QUIT', process.pid);
        process.exit(0);
        return;
    }

    var workerUID = getWorkerUID();
    var worker = cluster.fork({
        workerUID: workerUID
    });

    var workerPID = worker.process.pid;
    workerIds[workerUID] = workerPID;

    var checkInterval = setInterval(function () {
        if (!workers[workerPID]) {
            return clearInterval(checkInterval);
        }
        //未接收到心跳包次数超出限制,认为工作进程死掉，重新fork
        if (heartbeatCollection[workerPID] > NO_HEARTBEAT_COUNT_LIMIT) {
            appLogger.info("WORKER %d HANGUP", workerPID);
            try {
                workers[workerPID].kill();
            } catch (err) {
                appLogger.error('KILL HANGUP WORKER %d FAILED',workerPID);
            }
            return;
        }
        //向工作进程发起心跳消息
        worker.send({act:'heartbeat'});
        heartbeatCollection[workerPID] = (heartbeatCollection[workerPID] || 0);
        heartbeatCollection[workerPID]++;
    },3000);

    workers[workerPID] = worker;

    worker.on('message',function (message) {

        if (message && message.act) {
            var command = message.act;
            //工作进程发出自杀信号后，重新fork
            if (command === "suicide") {
                return deleteWorker(workerPID);
            }
            if (command === "heartbeat") {
                heartbeatCollection[workerPID] = 0;
                try {
                    process.stdout.write('200');
                } catch (err) {
                }
            }
        }
    });

    worker.on('exit',function (code) {
        appLogger.info("WORKER %d EXIT, EXIT CODE: %d", workerPID,code);

        //意外退出,重新fork
        if (!(code && code === 1)) {
            deleteWorker(workerPID);
        }
    });

    appLogger.info("WORKER %d CREATED", workerPID);
};

//杀死工作进程
var deleteWorker = function (workerPID,interval) {
    try {
        for (var id in workerIds) {
            if (workerIds[id] == workerPID) {
                workerIds[id] = null;
                break;
            }
        }
    } catch (err) {
    }

    createWorker();

    delete workers[workerPID];
    delete heartbeatCollection[workerPID];
    interval && clearInterval(interval);
};

//获取工作进程的唯一编号
var getWorkerUID = function () {
    for (var i = 1; i <= cpus.length; i++) {
        if (!workerIds[i]) {
            return i;
        }
    }
    return 0;
};

for (var i = 0; i < cpus.length; i++) {
	createWorker();
}

//主进程退出，工作进程退出
process.on('exit',function () {
    appLogger.info('MASTER %s EXIT',process.pid);
    for (var pid in workers) {
        workers[pid].kill();
    }  
});

