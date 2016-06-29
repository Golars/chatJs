var config = require('../test/config');
var expect = require('chai').expect;
var assert = require('chai').assert;
var io = require('socket.io-client');

describe('Socket BASE events', function(){

    var socket;
    this.timeout(15000);
    beforeEach(function(done) {
        // Setup
        console.log('Establishing connection');
        socket = io.connect(config.socketURL, config.options);
        socket.emit('checkToken', {'token': 1});

        socket.on('connect', function() {
            console.log('worked...');
            done();
        });
    });

    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            console.log('no connection to break...');
        }
        done();
    });


    it('BASE test Crypt', function(done){
        socket.on('checkToken', function(data){
            expect(data).to.have.a.property("status", config.status.ok);
            done();
        });
    })
});