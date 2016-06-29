
var Test = (function() {

    var DiffMessage = {
        type: function(given, types) {
            return "given: '" + given + "' instead of: '" + types + "'";
        },

        set: function(data, set) {
            return "value: '" + data + "' out of set: '" + set.join() + "'";
        }
    };

    function Result(equal, message) {
        this.isEqual = function() {
            return equal;
        };

        this.getMessage = function () {
            return message;
        };

        var path = [];

        this.addPath = function(key) {
            path.unshift(key);

            return this;
        };

        this.getPath = function() {
            return path.join('.');
        };
    }

    Result.CONFIG = 'undefined structure';

    var container = {
        custom: null,
        temporary: null,
        set: function(custom) {
            /**
             * TODO: need merge custom with existed to temporary
             */
            this.temporary = (this.custom || custom) ? custom : null;
        },
        get: function(types) {
            var custom, result = [];

            for (var index in types) {
                if (custom = this.temporary[types[index]]) {
                    result.push(custom);
                }
            }

            if (result.length) return result;
        },
        exist: function() {
            return this.temporary;
        }
    };

    var private = {

        structure: function(data, structure) {
            var result;

            if (structure["object"]) {

                for (var index in structure["object"]) {
                    if (result = this.compare(data[index], structure["object"][index])) {
                        return result.addPath(index);
                    }
                }

            } else if (structure["array"] && data) {

                if (typeof structure["array"] === "string") {

                    for (var index in data) {
                        if (result = this.compare(data[index], structure["array"])) {
                            return result.addPath(index);
                        }

                    }
                }

            } else if (structure["set"]) {

                if (structure["set"].indexOf(data) === -1) {
                    return new Result(false, DiffMessage.set(data, structure["set"]))
                }

            } else {
                return new Result(false, Result.CONFIG);
            }

        },

        types: function(data, structure) {
            var dataType = typeof data;

            var types = structure.split('|');

            if (types.indexOf(dataType) !== -1) return false;

            if (data === null && types.indexOf('null') !== -1) return false;

            if (container.exist()) {
                var intersect = container.get(types);

                if (intersect) {
                    var diff;

                    for (var index in intersect) {
                        if (diff = this.compare(data, intersect[index])) continue;

                        return false;
                    }

                    return diff;
                }
            }

            return new Result(false, DiffMessage.type(dataType, structure));

        },

        compare: function(data, structure) {

            if (structure) {
                if (typeof structure === "string") {
                    return this.types(data, structure);
                }

                if (typeof structure === "object") {
                    return this.structure(data, structure);
                }
            }

            return new Result(false, Result.CONFIG);
        },

        process: function(data, structure, custom) {
            container.set(custom);

            return this.compare(data, structure)
        }

    };

    return {

        errors: {
            config: Result.CONFIG
        },

        /**
         * @param data
         * @param structure
         * @param custom
         * @returns Result
         */
        check: function(data, structure, custom) {
            var result = private.process(data, structure, custom);

            return result || new Result(true);
        }
    }
})();


module.exports = Test;
