var util = require('util');
var Service = require('./Base').service;
var SocketService = require('./Socket');
var Model = require('../../models/user/user').User;



function service(){
    this.model = Model;
};
util.inherits(service, Service);


service.prototype.getRelation = function(cb) {
    if(!model.id) return cb('Undefined User');

    Model.findById(model.id)
        .populate('relations.user')
        .exec(function(err, user) {
            return cb(err, user.relations);
        })
}
service.prototype.getFriends = function(cb) {
    this.getRelation(function(err, relations){
        if(err) {
            console.log(err, "err");
            return cb(err);
        }
        return cb(null, relations.getCollectionByKey('getInfo'));
    })
}

service.prototype.getActiveFriends = function(cb) {
    this.getRelation(function(err, relations){
        var socketService = new SocketService();
        socketService.getActiveUserIdByIds(relations.getCollectionByKey("getUserId"),
            function(err, ids){
                var activeFriends = [];
                if(ids == undefined || !ids.length) {
                    return cb(null, []);
                }

                relations.getCollectionByKey('getInfo').forEach(function(model) {
                    model.isActive = (ids.length != 1) ? +(model.user.id in ids) : +(model.user.id == ids[0]);
                    activeFriends.push(model);
                })
                return cb(null, activeFriends);

            }
        )
    })
}
service.prototype.getActiveFriend = function(userId, cb) {
    if(!model.id) return cb('Undefined User');

    Model.findById(model.id, function(err, user) {
        if(err) {
            return cb(err);
        }

        var socketService = new SocketService();
        socketService.getActiveSocketsByUser(user.id,
            function(err, users){
                return cb(null, users);
            }
        )

    })
}

module.exports = service;


