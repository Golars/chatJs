var log = require('../libs/log')(module);
var config = require('../config');
var ShopModel = require('../database/models/shop');
var UserService = require('../database/services/user');

module.exports = function(socket, io) {
    socket.on('user.me', function(){
        if (!socket.isActiveSocket()) {
            return socket.sendError('errorGlobal', 401, 'First you need to activate WS connect');
        }

        socket.user.getFullInfo(function(err, info){
            if(err) {
                return socket.sendError('user.me', 400, err);
            }

            return socket.sendResponse('user.me', info);
        })
    });

    socket.on('user.info', function(data){
        if (!socket.isActiveSocket()) {
            return socket.sendError('user.info', 401, 'First you need to activate WS connect');
        }

        if(data.user_uid == undefined || !data.user_uid) {
            return socket.sendError('user.info', 404, 'UserId is empty');
        }

        UserService.getVkUserDataByUid(data.user_uid, socket.user.token, function(arg){
            UserService.getInfoUserFromData(arg, function (err, data) {
                if(err) {
                    return socket.sendError('user.info', 400, err);
                }

                return socket.sendResponse('user.info', data);
            })
        })

    });

    socket.on('user.friends', function(){
        if (!socket.isActiveSocket()) {
            return socket.sendError('errorGlobal', 401, 'First you need to activate WS connect');
        }

        socket.user.fetchVkFriends(function(err, info){
            if(err) {
                return socket.sendError('user.friends', 400, err);
            }

            return socket.sendResponse('user.friends', info);
        })
    });

    socket.on('user.shops', function(){
        if (!socket.isActiveSocket()) {
            return socket.sendError('user.shops', 401, 'First you need to activate WS connect');
        }
        console.log('parseUserShop');
        ShopModel.parseUserShop(socket.user, function(err, data){
            if(err) {
                return socket.sendError('user.shops', 400, err);
            }

            return socket.sendResponse('user.shops', data);
        })
    });
}