var mongoose = require('../../libs/mongoose'),
    Schema = mongoose.Schema;
var async = require('async');

var schema = new Schema({
    name: {
        required: true,
        unique: true,
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
});

schema.statics.createOrUpdate = function(name, callback) {
    var Model = this;
    Model.findOne({name: name}, function(err, model){
        if(err) {
            return callback(err);
        }
        
        if (model) {
            return callback(null, model);
        }

        model = new Model();
        model.name = name;
        model.save(function(err, saveModel){
            return callback(err, saveModel);
        })
    });
};

schema.statics.updateAll = function(names, callback) {
    var Model = this;
    async.map(names, function(name, cb){
        Model.findOne({name: name}, function(err, model){
            if (err || model) {
                return cb(err, {id : model.id, name: name});
            }

            model = new Model({name: name});
            model.save(function(err, model) {
                if(err) {
                    return cb(err);
                }

                return cb(null, {id : model.id, name: name});
            })
        })
    }, function(error, collections){
        callback(error, collections);
    });
};

module.exports = mongoose.model('Category', schema);
