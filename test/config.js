var Config = require('../config');
var log = require('../libs/log')(module);
var Mock = require('./mock/Model');

var config = {
    status : {
        error : Config.get("apiCode").error,
        ok : Config.get("apiCode").success
    },
    phone: "380636284343",
    socketURL :  Config.get('domain') + ':' + Config.get('port') + '/',
    options : {
        transports              : ['websocket'],
        'force new connection'  : true,
        'reconnection delay'    : 0,
        'reopen delay'          : 0
    },
    baseMock : Mock.Base
}

module.exports = config;