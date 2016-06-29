var Model = require('./Model');

var types = {
    shops : [
        {'count'            : "number"},
        {'collection'       : "array"},
        {'status'           : 'number'}
    ],

    shop : [
        {'id'               : "number"},
        {'name'             : "string"},
        {'screen_name'      : "string"},
        {'type'             : "string"},
        {'photo_200'        : "string"},
        {'members_count'    : "number"}
    ],

}

var method = {
    getShops : function(collection) {
        Model.Base.testDataByType(collection, types.shops);
        Model.Base.getAllSimple(collection, 'collection', method.getShop);
    },
    getShop : function(model) {
        Model.Base.testDataByType(model, types.shop);
    }
}
module.exports = method;