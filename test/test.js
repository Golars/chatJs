var expect = require('chai').expect;
var assert = require('chai').assert;
var BaseTest = require('../libs/testing')

describe('Test multi structure', function(){
    it('MULTI', function(done) {
        var data = [
            {
                "id": 1,
                "name": 'a'
            },
            {
                "object": {
                    "id": "number",
                    "name": "string"
                }
            }
        ];
        var diff = BaseTest.check(data[0], data[1], data[2]);
        assert.equal(diff.isEqual(), true, diff.getMessage());
        done();
    })
});