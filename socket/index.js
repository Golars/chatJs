var log = require('../libs/log')(module);

var request = require("request");
var config = require('../config');
var User = require('../database/models/user').Model;

module.exports = function(io) {
    io.on('connection', function (socket) {
        require('../socket/base')(socket);
        require('../socket/user')(socket);

        socket.on('updateToken', function(data){
            if (!socket.isActiveSocket()) {
                return socket.sendError('errorGlobal', 401, 'First you need to activate WS connect');
            }

            if(data.token == undefined || !data.token) {
                return socket.sendError('updateToken', 404, 'Token is empty');
            }

            socket.user.setToken(data.token, function (err, user) {
                if (err) {
                    return socket.sendError('updateToken', 400, err, err);
                }

                log.info('User update Token with uid ' + data.uid);
                socket.user = user;

                return socket.sendEmptyResponse('updateToken');
            });
        });

        socket.on('auth', function(data){
            if(data.uid == undefined || data.token == undefined) {
                return socket.sendError('auth', 403, 'Data is invalid');
            }

            console.log(data);
            User.authorize(data, function (err, user) {
                if (err) {
                    return socket.sendError('auth', 400, err, err);
                }

                log.info('User Auth with uid ' + data.uid);
                socket.user = user;
                socket.activeUserSocket();

                return socket.sendResponse('auth', {token : user.id});
            });
        });

        socket.on('checkToken', function(data){
            if(data.uid == undefined) {
                return socket.sendError('checkToken', 404, 'Uid is empty');
            }

            User.findOne(data, function(err, user){
                if (err || !user) {
                    return socket.sendError('checkToken', 403, 'User is not auth', err);
                }
                
                socket.user = user;
                socket.activeUserSocket();

                return socket.sendResponse('checkToken', {birka_token : socket.user.id});
            })
        });

        socket.on('recoveryConnection', function(data){
            if(data.birka_token == undefined) {
                return socket.sendError('recoveryConnection', 404, 'Birka Token is empty');
            }

            User.findById(data.birka_token, function(err, user){
                if (err || !user) {
                    return socket.sendError('recoveryConnection', 400, 'Birka Token is invalid', err);
                }
                socket.user = user;
                socket.activeUserSocket();

                return socket.sendEmptyResponse('recoveryConnection');
            })
        });
    });
}
