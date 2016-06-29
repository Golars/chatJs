
var Model = require('../../test/mock/Model');

var types = {
    birkaToken : [
        {'birka_token' : "string"},
        {'status'      : 'number'}
    ],
    testCrypt : [
        {'decode'       : "string"},
        {'code'         : "string"},
        {'status'       : 'number'}
    ]
}

var method = {
    getAuth : function(auth) {
        Model.Base.testDataByType(auth, types.birkaToken);
    },
    getTestCrypt : function(data) {
        Model.Base.testDataByType(data, types.testCrypt);
    }
}
module.exports = method;