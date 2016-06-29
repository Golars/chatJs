var config = require('../test/config');
var io = require('socket.io-client');
var fs  = require('fs');
var expect = require('chai').expect;
var assert = require('chai').assert;
var UserFixtures = require('./fixtures/Users');
var Mock = require('./mock/Auth');
var UserMock = require('./mock/User');
var crypto = require('crypto');


describe('Socket INDEX events', function(){
    var socket;
    var birkaToken;

    beforeEach(function(done) {

        // Setup
        console.log('Establishing connection');
        socket = io.connect(config.socketURL, config.options);

        socket.on('connect', function() {
            console.log('worked...');
            return done();
        });
    });

    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

    it('Auth', function(done){UserFixtures.admin
        socket.emit('auth', {
            "uid" : UserFixtures.admin.uid,
            "token" : UserFixtures.admin.token,
            "email" : UserFixtures.admin.email,
        });

        socket.on('auth', function(data){
            Mock.getAuth(data);
            birkaToken = data.birka_token;
            done();
        });
    })

    it('Test Cripto', function(done){
        var Crypt = require('../libs/crypt');
        var input = 'Data';
        var password = socket.id;
        Crypt.init(input, password);
        var code = Crypt.encrypt();
        socket.emit('testCrypt', {code: code});
        socket.on('testCrypt', function(data){
            Mock.getTestCrypt(data);
            expect(data.code).to.equal(code);
            expect(data.decode).to.equal(input);
            done();
        });
    })
    
    it('Check Token', function(done){
        socket.emit('checkToken', {
            "uid" : UserFixtures.admin.uid
        });

        socket.on('checkToken', function(data){
            Mock.getAuth(data);
            birkaToken = data.birka_token;
            done();
        });
    })

    it('User recovery Connection', function(done){
        socket.emit('recoveryConnection', {'birka_token' : birkaToken});

        socket.on('recoveryConnection', function(data){
            config.baseMock.ok(data);
            done();
        });
    })

    it('Update Token', function(done){
        socket.emit('recoveryConnection', {'birka_token' : birkaToken});

        socket.on('recoveryConnection', function(data){
            config.baseMock.ok(data);

            socket.emit('updateToken', {'token' : UserFixtures.admin.token});
        });
        socket.on('updateToken', function(data){
            console.log(data, UserFixtures.admin.token);
            config.baseMock.ok(data);
            done();
        });
    })

    it('Get User Me', function(done){
        socket.emit('recoveryConnection', {'birka_token' : birkaToken});

        socket.on('recoveryConnection', function(data){
            config.baseMock.ok(data);
            socket.emit('user.me');
        });

        socket.on('user.me', function(data){
            UserMock.getMe(data);
            done();
        });
    })
});