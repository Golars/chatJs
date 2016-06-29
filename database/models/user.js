var log = require('../../libs/log')(module);

var mongoose = require('../../libs/mongoose'),
    Schema = mongoose.Schema;

var Service = require('./../services/user');

var SEX = {
    ALIEN       : 0,
    WOMAN       : 1,
    MAN         : 2
};

var schema = new Schema({
    uid: {
        required: true,
        unique: true,
        type: Number
    },
    token: {
        type: String
    },
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    bdate: {
        required: true,
        type: String,
        get: function(bdate){
            return (bdate) ? bdate : '';
        },
        default: ''
    },
    deactivated: {
        type: Number,
        default: 0
    },
    city_id: {
        type: Number,
        default: 0
    },
    country_id: {
        type: Number,
        default: 0
    },
    friends_count: {
        type: Number,
        default: 0
    },
    followers_count: {
        type: Number,
        default: 0
    },
    photo_max_orig: {
        required: true,
        type: String,
        default: 'http://vk.com/images/camera_b.gif'
    },
    sex: {
        type: Number,
        default: SEX.ALIEN
    },
    dt_create: {
        type: Date,
        default: Date.now
    },
    dt_last_connect: {
        type: Date,
        default: Date.now
    }
});

schema.path('email').validate(function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}, 'The e-mail field cannot be empty.')

schema.methods.getShortInfo = function() {
    return {
        'id'                : this.id,
        'name'              : this.name,
        'cover'             : this.cover,
        'dt_update'         : this.dtUpdateTime
    };
};

schema.methods.getInfo = function() {
    return {
        'id'                : this.id,
        'uid'               : this.uid,
        'first_name'        : this.first_name,
        'last_name'         : this.last_name,
        'bdate'             : this.bdate,
        'sex'               : this.sex,
        'photo_max_orig'    : this.photo_max_orig
    };
};

schema.methods.getFullInfo = function(callback) {
    var model = this;

    Service.getVkUserData(model, function(arg){
        model.updateVkData(arg, function(){});
        return Service.getInfoFromData(arg, callback);
    })
};

schema.methods.setToken = function(token, callback) {
    if(this.token = token) {
        return callback(null, this);
    }
    this.token = token;
    this.save(function(err, model) {
        if (err) return callback(err);
        callback(null, model);
    });
}

schema.statics.authorize = function(data, callback) {
    var User = this;
    User.findOne({uid: data.uid}, function(err, user){
        if (!user) {
            user = new User(data);
        }

        user.token = data.token;
        user.uid = data.uid;

        if(!user.email && user.email != data.email){
            user.email = data.email;
        }

        user.dt_last_connect = new Date();
        Service.getVkUserData(user, function(arg){
            user.updateVkData(arg, callback);
        })
    });
};

schema.methods.updateVkData = function(data, callback) {
    var user = this;
    if(data.response[0].last_name == undefined) {
        return callback('Token is not valid. VK Data is empty');
    }
    var vkData = data.response[0];
    user.last_name = vkData.last_name;
    user.first_name = vkData.first_name;
    user.bdate = vkData.bdate;
    user.sex = vkData.sex;
    user.deactivated = vkData.deactivated;
    user.friends_count = vkData.followers_count || 0;
    user.followers_count = vkData.common_count || 0;

    if(vkData.id != user.uid){
        user.uid = vkData.id;
    }

    if(vkData.has_photo) {
        user.photo_max_orig = (vkData.photo_400_orig) ? vkData.photo_400_orig : vkData.photo_max;
    }

    if(vkData.city != undefined) {
        user.city_id = vkData.city.id
    }

    if(vkData.country != undefined) {
        user.country_id = vkData.country.id
    }
    user.save(function(err, model) {
        if (err) return callback(err);
        callback(null, model);
    });
}

schema.methods.fetchVkFriends = function(callback) {
    var data = {
        count : 0,
        collection : []
    };

    Service.getVkFriends(this, function(args){
        var response = args.response || {};
        if(response.count == undefined) {
            return callback('Token is not valid. VK Data is empty');
        }
        if(!response.count) {
            return callback(null, data);
        }
        if(response.count) {
            data.count = response.count;
            data.collection = response.items.map(function (model) {
                return {
                    'uid': model.id,
                    'first_name': model.first_name,
                    'last_name': model.last_name,
                    'photo_max_orig': (model.photo_400_orig) ? model.photo_400_orig : model.photo_max
                };
            });
        }

        return callback(null, data);
    })
};

schema.methods.updateUserConnect = function() {
    this.dt_last_connect = new Date();
    this.save();
};

exports.Model = mongoose.model('User', schema);
