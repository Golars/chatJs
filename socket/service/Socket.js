var util = require('util');
var Service = require('./Base').service;
var Model = require('./../../models/base/sockets');

function service(){
    this.model = Model;
    this.collection = [];
};
util.inherits(service, Service);

service.prototype.getActiveUsers = function(cb) {
    Model.find(function(err, users) {
        return cb(err, users);
    })
}

service.prototype.getActiveSocketsByUser = function(UserId, cb) {
    if(!UserId){
        cb("Friends is not found");
    }
    Model.findOne({user: UserId}, function(err, model) {
        return cb(err, model.sockets);
    })
}

service.prototype.getActiveUserIdByIds = function(UsersIds, cb) {
    if(!UsersIds.length){
        cb("Friends is not found");
    }
    Model.find({"user": {$in: UsersIds}}, function(err, models) {
        return (models != undefined && models.length) ? cb(err, models.getCollectionField('user'), models) : cb(err, models);
    })
}

//todo need FIX
service.addActiveSocket = function(socket, cb) {
    if(!socket){
        cb("Socket Is not get");
    }
    Model.findOne({user: socket.user.id}, function(err, model) {
        if(err) {
            return cb(err);
        }
        if(!model) {
            model = new Model({user: socket.user.id});
        }
        if(socket.id in model.sockets.getCollectionField('id')) {
            return cb();
        }

        model.sockets.push(socket.id);
        model.save(function(err) {
            return cb(err);
        })
    })
}

//todo need FIX
service.deleteActiveSocket = function(socket, cb) {
    if(!(socket == undefined && socket.user == undefined && socket.user.id == undefined)){
        cb("Socket Is not get");
    }
    Model.findOne({user: socket.user.id}, function(err, model) {
        if(err || !model) {
            return cb(err);
        }

        model.sockets.pull(socket.id);
        model.save(function(err) {
            return cb(err);
        })
    })
}

module.exports = service;


