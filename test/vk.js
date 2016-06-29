var config = require('../test/config');
var io = require('socket.io-client');
var fs  = require('fs');
var expect = require('chai').expect;
var assert = require('chai').assert;
var vk = require('../libs/vk');
var https = require('https');

var token = '9275d1e6875dd68999f5975e5d6ce906dbbb441c0426176b55a3756acba2a9686a284e4a70f2cb01c6dfd';
vk.setSecureRequests(1);
vk.requestServerToken();

// Waiting for special 'serverTokenReady' event
var start = (new Date()).getTime();
console.log(start, 'START');

describe('VK Server Methods', function(){
    before(function(done) {
        // Setup
        console.log('Establishing connection');
        vk.on('serverTokenReady', function(_o) {
            // Here will be server access token
            vk.setToken(token);
            console.log(vk.getToken(), "\n\n");
            done();
        });
    });

    afterEach(function(done) {
        // Cleanup
        console.log('disconnecting...');
        done();
    });

    it('getProfiles', function(done){
        vk.setSecureRequests(true);
        vk.setVersion('5.50');
        vk.request('users.get', {fields : 'has_photo,photo_max,sex,bdate,city,country,deactivated'});
        vk.on('done:users.get', function(arg) {
            console.log(arg);
            console.log((new Date()).getTime() - start);
            done();
        });
    })

    it('getFriends', function(done){
        vk.setSecureRequests(true);
        vk.setVersion('5.50');
        vk.request('friends.get', {fields : 'has_photo,photo_max,sex,bdate,city,country, online'});
        vk.on('done:friends.get', function(arg) {
            console.log((new Date()).getTime() - start);
            done();
        });
    })
    it('getUsersMarket', function(done){
        vk.setSecureRequests(true);
        vk.setVersion('5.50');

        vk.request('groups.get', {
            offset: 0,
            fields : 'description,city, country, photo_200, type,members_count,market,age_limits',
            count : 1000,
            extended : 1
        });
        vk.on('done:groups.get', function(arg) {
            console.log(arg);
            done();
        });
    })
    it('get User by id', function(done){
        vk.setSecureRequests(true);
        vk.setVersion('5.50');


        var permissions = [
            'has_photo',
            'photo_max',
            'photo_400_orig',
            'sex',
            'bdate',
            'city',
            'country',
            'is_friend',
            'common_count',
            'followers_count',
            'common_count',
            'deactivated'
        ];

        vk.request('users.get', {user_ids: 74756569, fields : permissions.toString()});
        vk.on('done:groups.get', function(arg) {
            console.log(arg);
            done();
        });
    })
});