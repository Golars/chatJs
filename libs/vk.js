/*VK get token
 https://oauth.vk.com/authorize?client_id=5523900&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,photos,status,offers,email,stats,market,offline&response_type=token&v=5.50
 https://oauth.vk.com/access_token?client_id=5523900&client_secret=x7pRWUvJFNk48UQs1VTK&v=5.50&grant_type=client_credentials
*/
var config = require('../config');
var token = '8bdcd1706bd89ee7669513103dc27a1e8b44e57d3b059db228ecce2c55216f9753f41205e3a3b65c21006';

var VK = require('vksdk');
var vk = new VK({
    'appId'     : config.get('vk:id'),
    'appSecret' : config.get('vk:secret'),
    'version'   : config.get('vk:version')
});

vk.setToken(token);
vk.setVersion(config.get('vk:version'));
vk.setSecureRequests(true);

vk.parseGetAll = function(args, callback){
    var response = args.response || {};
    if(response.count == undefined || !response.count) {
        return callback('Token is not valid. VK Data is empty');
    }

    return callback(null, response);
}

module.exports = vk;