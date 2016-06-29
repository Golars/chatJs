var vk = require('../../libs/vk');
var UserModel = require('../../database/models/user').Model;

var service = {
    getOne : function(queries, callback){
        if (queries == undefined || !queries) {
            return callback('Model not Found. Filter params is empty.');
        }

        var query = UserModel.findOne(queries);
        query.exec(function(err, model) {
            return callback(err, model);
        })
    },

    getFullInfo: function(userUid, token, callback){
        this.getVkUserDataByUid(model, function(arg){
            model.updateVkData(arg, function(){});

            return this.getInfoFromData(arg, callback)
        })
    },

    getInfoFromData: function(data, callback){
        if(data.response[0].id == undefined) {
            return callback('VK Data is empty');
        }
        var vkData = data.response[0];
        return callback(null, {
            'uid'               : vkData.id,
            'first_name'        : vkData.first_name,
            'last_name'         : vkData.last_name,
            'bdate'             : vkData.bdate,
            'sex'               : vkData.sex,
            'city'              : (vkData.city != undefined && vkData.city.id != undefined) ? vkData.city.title : '',
            'country'           : (vkData.country != undefined && vkData.country.id != undefined) ? vkData.country.title : '',
            'friends_count'     : vkData.common_count,
            'followers_count'   : vkData.followers_count,
            'photo_max_orig'    : (vkData.photo_400_orig) ? vkData.photo_400_orig : vkData.photo_max,
            'products_count'    : 0,
            'favorites'         : []
        });
    },

    getInfoUserFromData: function(data, callback){
        if(data.response[0].id == undefined) {
            return callback('VK Data is empty');
        }
        var vkData = data.response[0];
        return callback(null, {
            'uid'               : vkData.id,
            'first_name'        : vkData.first_name,
            'last_name'         : vkData.last_name,
            'bdate'             : vkData.bdate,
            'sex'               : vkData.sex,
            'city'              : (vkData.city != undefined && vkData.city.id != undefined) ? vkData.city.title : '',
            'country'           : (vkData.country != undefined && vkData.country.id != undefined) ? vkData.country.title : '',
            'common_count'      : vkData.common_count,
            'followers_count'   : vkData.followers_count,
            'photo_max_orig'    : (vkData.photo_400_orig) ? vkData.photo_400_orig : vkData.photo_max,
            'is_friend'         : vkData.is_friend,
            'products_count'    : 0,
            'favorites'         : []
        });
    },

    getVkUserDataByUid : function(userUid, token, callback) {
        vk.setSecureRequests(true);
        vk.setToken(token);

        var permissions = [
            'has_photo',
            'photo_max',
            'photo_400_orig',
            'sex',
            'bdate',
            'city',
            'country',
            'is_friend',
            'common_count',
            'followers_count',
            'common_count',
            'deactivated'
        ];

        return vk.request('users.get', {user_ids: userUid, fields : permissions.toString()}, callback);
    },

    getVkUserData : function(userModel, callback) {
        this.getVkUserDataByUid(userModel.uid, userModel.token, callback);
    },

    getVkFriends : function(userModel, callback) {
        vk.setSecureRequests(true);
        vk.setToken(userModel.token);

        var permissions = [
            'has_photo',
            'photo_max',
            'photo_400_orig',
            'sex',
            'bdate',
            'city',
            'country',
            'is_friend',
            'online'
        ];

        return vk.request('friends.get', {user_ids: userModel.uid, fields : permissions.toString()}, callback);
    }
};

module.exports = service;