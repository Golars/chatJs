var mongoose = require('mongoose');
var config = require('../config');
var log = require('../libs/log')(module);
console.log(config.get('mongoose:url'))

mongoose.connect(config.get('mongoose:url'), config.get('mongoose:options'));
log.info('Mongoose connect');

module.exports = mongoose;