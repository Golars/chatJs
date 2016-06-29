var log = require('../../libs/log')(module);

var mongoose = require('../../libs/mongoose'),
    Schema = mongoose.Schema;

var Section = require('./section');
var Category = require('./category');

var STATUS = {
    CLOSE       : 0,
    ACTIVE      : 1,
    PARSE       : 2,
    ERROR       : 3
};

var price = new Schema({
    amount: {
        required: true,
        type: Number
    },
    currency: {
        id: {
            required: true,
            type: Number
        },
        name: {
            required: true,
            type: String
        }
    },
    text: {
        required: true,
        type: String
    },
})

var schema = new Schema({
    id: {
        required: true,
        unique: true,
        type: Number
    },
    owner_id: {
        required: true,
        type: Number
    },
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    price: {
        type: price
    },
    photos: {
        type: Schema.Types.Mixed
    },
    category: { type: Schema.Types.ObjectId, refPath: 'Category' },
    section: { type: Schema.Types.ObjectId, refPath: 'Section' },
    thumb_photo: {
        required: true,
        type: String,
        default: 'http://vk.com/images/camera_b.gif'
    },
    date: {
        type: Number,
        default: 0
    },
    can_comment: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    views_count: {
        type: Number,
        default: 0
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
            return callback(err);
        }

        if (model && model.date != data.date) {
            return callback(null, model);
        }

        model = model || new Model();

        model.id = data.id;
        model.owner_id = data.owner_id;
        model.title = data.title;
        model.description = data.description;
        model.thumb_photo = data.thumb_photo;
        model.price = data.price;
        model.date = data.date;
        model.photos = data.photos;
        model.can_comment = data.can_comment;
        model.category = data.categoryId || null;
        model.section = data.sectionId || null;
        model.likes = data.likes.count || 0;
        model.views_count = data.views_count || 0;
        model.status = STATUS.ACTIVE;

        return model.save(callback);
    });
};

module.exports = mongoose.model('Product', schema);
module.exports.STATUS = STATUS;
