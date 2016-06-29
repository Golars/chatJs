var log = require('../libs/log')(module);
var config = require('../config');

var usersSocketIds = [];

module.exports = function(socket) {
    socket.option = {
        activate    : false
    };

    socket.activeUserSocket = function(){
        socket.option.activate = true;
        usersSocketIds[socket.user.uid] = socket.id;
    }

    socket.isActiveSocket = function(){
        return (socket.option.activate === true && socket.user != undefined  && socket.user.token);
    }

    socket.sendEmptyResponse = function(event, status) {
        var status = (status == undefined) ? config.get("apiCode").success : status;
        return socket.sendResponse(event, {}, status);
    }

    socket.sendResponse = function(event, data, status) {
        data = data || {};
        data.status = (status != undefined) ? status : config.get("apiCode").success;
        return socket.emit(event, data);
    }

    socket.sendError = function(event, status, name, error) {
        console.error("EVENT: " + event + " STATUS:" + status + "\nERROR :\t", name, error, "\n");
        name = JSON.stringify(name) || 'ERROR';
        status = status || config.get("apiCode").error;
        return socket.sendResponse(event, {error: name}, status)
    }

    socket.on('testCrypt', function(data){
        var Crypt = require('../libs/crypt');
        Crypt.init(data.code, socket.getUserSocketId());
        socket.sendResponse('testCrypt', {code: data.code, decode: Crypt.decrypt()});
    })

    socket.getUserSocketId = function(){
        return socket.id.replace(/^\/#/, '');
    }

    socket.on('connect', function(){
        console.log("User connect socket_id" + socket.id);
        log.info('User connect socket_id' + socket.id);
    })
    socket.on('reconnect', function(){
        console.log("User reconnect socket_id" + socket.id);
        log.info('User reconnect socket_id' + socket.id);
    })

    socket.on('disconnect', function(){
        var uid = (socket.uid !== undefined) ? socket.user.uid : 'noUid';

        log.info('User disconnect with uid : ' + uid + 'Date :' + (new Date()).toLocaleTimeString());
        if(socket.id == undefined || socket.user == undefined) {
            return;
        }
    })

    socket.on('close', function(){
        log.info('User close');
    })
}
