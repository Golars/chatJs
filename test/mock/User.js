var expect = require('chai').expect;
var assert = require('chai').assert;

var Model = require('../../test/mock/Model');
var ShopMock = require('./Shop');

var types = {
    me : [
        {'uid'              : "number"},
        {'first_name'       : "string"},
        {'last_name'        : "string"},
        {'sex'              : "number"},
        {'city'             : "string"},
        {'country'          : "string"},
        {'friends_count'    : "number"},
        {'followers_count'  : "number"},
        {'bdate'            : "string"},
        {'photo_max_orig'   : "string"},
        {'products_count'   : "number"},
        {'favorites'        : "array"},
        {'status'           : 'number'}
    ],
    info : [
        {'uid'              : "number"},
        {'first_name'       : "string"},
        {'last_name'        : "string"},
        {'sex'              : "number"},
        {'city'             : "string"},
        {'country'          : "string"},
        {'common_count'     : "number"},
        {'followers_count'  : "number"},
        {'bdate'            : "string"},
        {'photo_max_orig'   : "string"},
        {'products_count'   : "number"},
        {'is_friend'        : "number"},
        {'favorites'        : "array"},
        {'status'           : 'number'}
    ],
    friends : [
        {'count'            : "number"},
        {'collection'       : "array"},
    ],
    getFriendsOnly : [
        {'count'            : "number"},
        {'collection'       : "array"},
        {'status'           : 'number'}
    ],
    friend : [
        {'uid'              : "number"},
        {'first_name'       : "string"},
        {'last_name'        : "string"},
        {'photo_max_orig'   : "string"}
    ],
}

var method = {
    getMe : function(data) {
        Model.Base.testDataByType(data, types.me);
    },
    getInfo : function(data) {
        Model.Base.testDataByType(data, types.info);
    },
    getFriends : function(friends) {
        Model.Base.testDataByType(friends, types.friends);
        Model.Base.getAllSimple(friends, 'collection', method.getFriend);
    },
    getFriendsOnly : function(friends) {
        Model.Base.testDataByType(friends, types.getFriendsOnly);
        Model.Base.getAllSimple(friends, 'collection', method.getFriend);
    },
    getFriend : function(friend) {
        Model.Base.testDataByType(friend, types.friend);
    }
}
module.exports = method;