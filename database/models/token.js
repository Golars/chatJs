var mongoose = require('../../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    token: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports.schema = schema;
module.exports = mongoose.model('Token', schema);

