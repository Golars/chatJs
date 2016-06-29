var expect = require('chai').expect;
var types = {
    'ok' : [
        {'status' : 'number'}
    ]
};

var methods = {
    getAll : function(data, categoryName, methodTest){
        var getAlltypes = [
            {'limit'          : "number"},
            {'offset'         : "number"},
            {'count'          : "number"},
            {'status'         : "number"},
        ];
        var objName = {};
        objName[categoryName] = 'array';
        getAlltypes.push(objName);
        methods.testDataByType(data, getAlltypes);
        expect(data).to.have.property(categoryName);
        data[categoryName].forEach(function(model) {
            methodTest(model);
        })
    },
    getAllSimple: function(data, categoryName, methodTest){
        expect(data).to.have.property(categoryName);
        data[categoryName].forEach(function(model) {
            methodTest(model);
        })
    },
    getFildsByType: function(types){
        var results = [];
        types.forEach(function(obj) {
            results.push(Object.keys( obj )[0]);
        })
        return results;
    },
    testDataByType: function(data, types){
        expect(data.error).to.not.be.ok;
        expect(data).to.have.all.keys(this.getFildsByType(types));
        types.forEach(function(type){
            expect(data[Object.keys(type)[0]]).to.be.a(type[Object.keys(type)[0]], 'Field ' + Object.keys(type)[0] + ' to be a ' + type[Object.keys(type)[0]]);
        });
    },
    ok: function(data){
        methods.testDataByType(data, types.ok);
    }
}
module.exports = types;
module.exports.Base = methods;