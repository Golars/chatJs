var log = require('../../libs/log')(module);
var vk = require('../../libs/vk');

var mongoose = require('../../libs/mongoose'),
    Schema = mongoose.Schema;

var STATUS = {
    CLOSE       : 0,
    ACTIVE      : 1,
    PARSE       : 2,
    ON_PARSE    : 4,
    ERROR       : 3
};

var schema = new Schema({
    id: {
        required: true,
        unique: true,
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    screen_name: {
        required: true,
        type: String
    },
    type: {
        required: true,
        type: String
    },
    photo_200: {
        required: true,
        type: String,
        default: 'http://vk.com/images/camera_b.gif'
    },
    status: {
        type: Number,
        default: STATUS.PARSE
    }
});

schema.statics.createOrUpdate = function(data, callback) {
    var Model = this;
    Model.findOne({id: data.id}, function(err, model){
        if(err) {
            callback(err);
        }
        
        if (model) {
            return callback(null, model);
        }

        model = new Model(data);
        model.id = data.id;
        model.name = data.name;
        model.screen_name = data.screen_name;
        model.type = data.type;
        model.photo_200 = data.photo_200;

        model.save(function(err, model) {
            return callback(err, model);
        });
    });
};


schema.statics.parseUserShop = function(userModel, callback) {
    vk.setSecureRequests(true);
    vk.setToken(userModel.token);
    var fields = [
        'has_photo',
        'members_count',
        'market',
        'age_limits',
        'city',
        'country',
        'is_admin',
        'photo_200'
    ];

    var data = {
        count : 0,
        collection : []
    };

    vk.request('groups.get', {
        offset: 0,
        count : 1000,
        extended : 1,
        fields : fields.toString()
    }, function(args){
        var response = args.response;
        if(response.count == undefined) {
            return callback('Token is not valid. VK Data is empty');
        }
        if(!response.count) {
            return callback(null, data);
        }

        response.items.map(function (model) {
            if(model.deactivated) {
                return false;
            }
            if(!model.market.enabled) {
                return false;
            }

            data.collection.push({
                'id': model.id,
                'name': model.name,
                'screen_name': model.screen_name,
                'type': model.type,
                'photo_200': model.photo_200,
                'members_count': model.members_count,
                'is_admin': model.is_admin,
                // 'city': (model.city != undefined) ? model.city.id : 0,
                // 'country': (model.country != undefined) ? model.country.id : 0
            });
        });
        data.count = data.collection.length || data.count;
        return callback(null, data);
    });
};

module.exports = mongoose.model('Shop', schema);
module.exports.STATUS = STATUS;
