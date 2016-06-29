nconf = require('nconf');
var path = require('path');
var log = require('../libs/log')(module);
var ENV = process.env.NODE_ENV;
var configFileName = (ENV == 'development') ?  'conf.local.json' : 'conf.json';
nconf.argv()
    .env()
    .file({ file: path.join(__dirname, configFileName) });

Array.prototype.getCollectionByKey = function(key){

    var collection = [];

    this.forEach(function(model) {
        if(model[key] != undefined) {
            collection.push(model[key]())
        }
    })
    return collection;
}
Array.prototype.getCollectionField = function(key){
    var collection = [];


    if(!this.length){
        return collection;
    }

    this.forEach(function(model) {
        if(model[key] != undefined) {
            collection.push(model[key])
        }
    })
    return collection;
}
Array.prototype.hasValue = function(key){
    var has = false;
    this.forEach(function(model) {
        has = has || (model == key);
    })
    return has;
}

Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}

global.BaseUrl = nconf.get('domain') + nconf.get('urlSuf');
global.BaseMediaUrl = global.BaseUrl + '/tmp';
global.BasePublickPath = __dirname + '/../tmp';
global.BaseFunction = {
    getDtCloseByHours :function (Hours, dt){
        var date = (dt) ? new Date(dt) : new Date();
        return new Date(date.setHours(date.getHours() + Hours));
    }
}

module.exports = nconf;