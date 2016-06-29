var winston = require('winston');
var pathModule = require('path');
var ENV = process.env.NODE_ENV;

winston.cli();
function getLogger(module, filePref) {
    filePref = filePref || '';
    var path = module.filename.split(pathModule.sep).slice(-2).join(pathModule.sep);
    var defConfig = {
        json: true,
        timestamp: true,
        colorize : true,
        level : 'debug',
        // level : (ENV == 'development') ? 'debug' : 'error',
        label : path,
        setMaxListeners : 9000
    };
    return new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(defConfig),
            new winston.transports.File({ filename: __dirname + '/' + filePref + 'debug.log', json: false })
        ],

        exceptionHandlers: [
            new (winston.transports.Console)(defConfig),
            new winston.transports.File({ filename: __dirname + '/' + filePref + 'exceptions.log', json: false })
        ],
        exitOnError: false
    }).cli();
}


module.exports = getLogger;
