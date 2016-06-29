var crypto = require('crypto');

var Cript = {
    data: '',
    key: '',
    iv: '',
    init : function(data, password){
        if(!data || !password) {
            return;
        }

        var m = crypto.createHash('md5');
        m.update(password)
        this.key = m.digest('hex');

        m = crypto.createHash('md5');
        m.update(password + this.key)
        this.iv = m.digest('hex');
        this.data = data;
    },
};

Cript.encrypt = function () {
    var data = new Buffer(this.data, 'utf8').toString('binary');
    var cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv.slice(0,16));
    var encrypted = cipher.update(data, 'utf8', 'binary') + cipher.final('binary');
    return new Buffer(encrypted, 'binary').toString('base64');
};

Cript.decrypt = function () {
    var input = this.data.replace(/\-/g, '+').replace(/_/g, '/');
    var eData = new Buffer(input, 'base64').toString('binary')

    var decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv.slice(0,16));
    return (decipher.update(eData, 'binary', 'utf8') + decipher.final('utf8'));
};

module.exports = Cript;