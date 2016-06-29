var AllResponse = {
    limit   : 20,
    offset  : 0,
    count   : 0
}

// Средство для переопределения функций
function override(child, fn) {
    child.prototype[fn.name] = fn;
    fn.inherited = child.super_.prototype[fn.name];
}

function service(){
    var self = this;
    this.model = {};
    this.infoMethodName = 'getInfo';
    this.collectionName = 'base';
    this.populate = '';
}

service.prototype.init = function(){
    console.log('Base INIT \n\n\t');
}

service.prototype.setPopulateToModel = function(query){
    if(!this.populate) {
        return;
    }
    if(!this.populate.isArray) {
        return query.populate(this.populate);
    }
    this.populate.forEach(function(populate){
        query.populate(populate);
    })
}

service.prototype.setModel = function(Model) {
    model = Model;
}
service.prototype.getModel = function() {
    return this.model;
}
service.prototype.getAll = function(queries, params, cb){
    var self = this;
    var response = {};
    response[self.collectionName] = [];
    for(var propertyName in AllResponse) {
        response[propertyName] = (params != undefined && params[propertyName] != undefined) ? params[propertyName] : AllResponse[propertyName];
    }

    self.model.count(queries)
        .exec(function(err, count) {
        if(err) {
            return cb(err);
        }
        response.count = count;
        if(!count) {
            return cb(null, response);
        }

        var query = self.model.find(queries);
        query.limit(response.limit).skip(response.offset);
        self.setPopulateToModel(query);
        query.exec(function(err, models){
            if(err) {
                return cb(err);
            }
            if(models.length) {
               models.forEach(function(model){
                   response[self.collectionName].push(model[self.infoMethodName]());
               })
            }

            return cb(null, response);
        })
    })


}

service.prototype.getOne = function(queries, callback) {
    if (queries == undefined || !queries) {
        return callback('getOne: Query is empty');
    }

    var self = this;
    var query = self.model.findOne(queries);
    self.setPopulateToModel(query);
    query.exec(function(err, model) {
            return callback(err, model);
        })
}

service.prototype.getById = function(id, queries, callback) {
    if (id == undefined || !id) {
        console.log('Base:getById Id is empty');
        return callback('Id is empty');
    }

    var self = this;
    var query = self.model.findById(id, queries);
    self.setPopulateToModel(query);
    query.exec(function(err, model) {
        return callback(err, model);
    })
}

module.exports.service = service;
module.exports.override = override;
module.exports.AllResponse = AllResponse;
