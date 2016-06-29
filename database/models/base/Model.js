var Model = {};

//todo need rewrite (one get values to one constant)
Model.getConstantValue = function(constant){
    var values = [];
    var keys = Object.keys(constant);
    if (keys.length) {
        keys.forEach(function(key) {
            values.push(constant[key]);
        })
    }
    return values;
}

module.exports = Model;