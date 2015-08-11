var path = require('path');

var log4js = require('log4js');

module.exports = (function () {

    //客户端ip |请求地址 |请求方法 |HTTP版本 |请求状态 |响应时间 |请求来源 |请求内容大小 |浏览器ua
    var logFormat = [':remote-addr', ':url', ':method', ':http-version', ':status', ':response-time', ':referrer', ':content-length', ':user-agent'];

    var logPath = path.join(__dirname,"../log/");

    //日志类型
    var appender = function (logName,isWorker) {
        var logId = '';
        if (isWorker) {
            logId = (process.env.workerUID && process.env.workerUID.toString()) || "1";
        }
        return {
            type: 'dateFile',
            absolute: true,
            filename: path.join(logPath, logName + logId),
            maxLogSize: 1024 * 1024,
            backup: 3,
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: logName
        }
    };

    //配置日志信息
    log4js.configure({
        appenders: [appender('app'), appender('access',true), appender('error',true)],//配置app日志、访问日志、错误日志
        //levels: {
            //"error": "ERROR"
        //},
        replaceConsole: true
    });

    return {

        getLogger: function (logName) {
            return log4js.getLogger(logName);
        },

        logConnect: function (logName, format) {
            var logger = this.getLogger(logName);

            //设置level为auto，遇到4xx和5xx会自动记录error级日志
            var logPattern = {
                level: 'auto',
                format: format || logFormat.join(' |')
            };
            return log4js.connectLogger(logger, logPattern);
        }

    };

})();
