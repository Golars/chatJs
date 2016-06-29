
function serverUrl(URL) {
    var URL = URL;
    this.parseUrl = function(url){
        var url = (url) ? url : URL;
        if (url.indexOf('?') === -1) return {};

        var ret = {},
            seg = url.replace(/^.*\?/,'').split('&'),
            len = seg.length, i = 0, s;

        for (;i<len;i++) {
            if (!seg[i]) {continue;}
            s = seg[i].split('=');
            ret[s[0]] = s[1];
        }
        return ret;
    }
    return this;
}


module.exports = serverUrl;
