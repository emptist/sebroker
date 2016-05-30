// Generated by CoffeeScript 1.10.0
var CookieJar, address, async, cookies, fetchStream, fetchUrl, fetchpage, getheaders, hddInfo, obj, oldcookies, postheaders, ref, ref1, ref2, servicePwd, trdpwd, trdpwdEns, url, userName, util, vcode, vcurl;

util = require('util');

async = require('async');

vcode = require('./getvcode');

hddInfo = require('./hddInfo');

address = require('./getaddress');

ref = require('./.mainaccount'), userName = ref.userName, trdpwd = ref.trdpwd, trdpwdEns = ref.trdpwdEns, servicePwd = ref.servicePwd;

ref1 = require('../refs/experiments/options'), postheaders = ref1.postheaders, getheaders = ref1.getheaders;

ref2 = require('fetch'), fetchUrl = ref2.fetchUrl, fetchStream = ref2.fetchStream, CookieJar = ref2.CookieJar;

delete postheaders.cookies;

cookies = new CookieJar();

cookies.setCookie(getheaders.cookies);

oldcookies = cookies;

url = 'https://service.htsc.com.cn/service/login.jsp';

fetchpage = function(callback) {
  return fetchUrl(url, {
    headers: getheaders,
    method: 'GET',
    cookieJar: cookies
  }, function(err, meta, body) {
    return callback(err, meta, body);
  });
};

vcurl = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=" + (Math.random());

obj = {
  req: function(callback) {
    return setTimeout((function() {
      return fetchpage(callback);
    }), 200);
  },
  vcode: function(callback) {
    return setTimeout((function() {
      return vcode(vcurl, callback);
    }), 200);
  },
  ipmac: function(callback) {
    return setTimeout((function() {
      return address(callback);
    }), 400);
  }
};

async.parallel(obj, function(err, results) {
  var callback, ip, mac, options, ref3, req;
  (ref3 = results.ipmac, ip = ref3.ip, mac = ref3.mac), vcode = results.vcode, req = results.req;
  url = 'https://service.htsc.com.cn/service/loginAction.do?method=login';
  options = {
    method: "POST",
    url: url,
    headers: postheaders,
    cookieJar: cookies,
    payload: "userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&macaddr=60:33:4B:09:BF:0F&hddInfo=" + hddInfo + "&lipInfo=192.168.1.101+&CPU=QkZFQkZCRkYwMDAzMDY2MQ%3D%3D&PCN=U0RXTS0yMDEzMDkxNFNX&PI=QyxOVEZTLDYwLjAwMzg%3D&topath=null&accountType=1&userName=080300007199&servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode=" + (vcode.trim())
  };
  encodeURIComponent({
    loginEvent: 1,
    topath: null,
    accountType: 1,
    userType: 'jy',
    userName: userName,
    trdpwd: trdpwd,
    trdpwdEns: trdpwdEns,
    servicePwd: servicePwd,
    macaddr: '60:33:4B:09:BF:0F',
    lipInfo: "" + ip,
    vcode: "" + (vcode.trim()),
    hddInfo: "" + hddInfo
  });
  callback = function(err, meta, data) {
    var body;
    if (err) {
      return console.error(err);
    } else {
      body = data.toString();
      if ((body.indexOf('欢迎')) < 0) {
        return console.error(meta.cookieJar.cookies);
      } else {
        return console.log(meta.cookieJar.cookies, body);
      }
    }
  };
  return fetchUrl(url, options, callback);
});


/*  採用fetch模塊,實現登錄的理論過程:
    get 'https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=' 獲取驗證碼
    get 'https://service.htsc.com.cn/service/login.jsp' 以便取得並記住cookies
    post  'https://service.htsc.com.cn/service/loginAction.do?method=login' 登錄
 */

//# sourceMappingURL=fetchlogin.js.map