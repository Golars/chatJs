var config = require('../test/config');
var io = require('socket.io-client');
var fs  = require('fs');
var UserFixtures = require('./fixtures/Users');
var Mock = require('./mock/Auth');
var UserMock = require('./mock/User');
var ShopMock = require('./mock/Shop');


describe('Socket USER events', function(){
    var socket;
    var birkaToken;

    beforeEach(function(done) {
        // Setup
        console.log('Establishing connection');
        socket = io.connect(config.socketURL, config.options);

        socket.on('connect', function() {
            socket.emit('checkToken', {
                "uid" : UserFixtures.admin.uid
            });

            socket.on('checkToken', function(data){
                Mock.getAuth(data);
                birkaToken = data.birka_token;

                socket.emit('recoveryConnection', {'birka_token' : birkaToken});
                done();
            });
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

    it('Get User Me', function(done){
        socket.on('recoveryConnection', function(data){
            config.baseMock.ok(data);
            socket.emit('user.me');
        });

        socket.on('user.me', function(data){
            console.log(data);
            UserMock.getMe(data);
            done();
        });
    })

    it('Get User Friends', function(done){
        socket.on('recoveryConnection', function(data){
            config.baseMock.ok(data);
            socket.emit('user.friends');
        });

        socket.on('user.friends', function(data){
            UserMock.getFriendsOnly(data);
            done();
        });
    })

    it('Get Shops', function(done){
        socket.on('recoveryConnection', function(data){
            config.baseMock.ok(data);
            socket.emit('user.shops');
        });

        socket.on('user.shops', function(data){
            ShopMock.getShops(data);
            console.log(data);
            done();
        });
    })

    it('Get User Info', function(done){
        socket.on('recoveryConnection', function(data){
            config.baseMock.ok(data);
            socket.emit('user.info', {user_uid: 74756569});
        });

        socket.on('user.info', function(data){
            console.log(data);
            UserMock.getInfo(data);
            done();
        });
    })
});