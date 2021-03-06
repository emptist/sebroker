// Generated by CoffeeScript 1.10.0
var address, async, hddInfo, obj, qs, r, ref, request, servicePwd, trdpwd, trdpwdEns, userName, util, vcode, vcurl;

util = require('util');

async = require('async');

request = require('request');

qs = require('querystring');

vcode = require('./getvcode');

hddInfo = require('./hddInfo');

address = require('./getaddress');

ref = require('./.mainaccount'), userName = ref.userName, trdpwd = ref.trdpwd, trdpwdEns = ref.trdpwdEns, servicePwd = ref.servicePwd;


/*
  採用request模塊,實現登錄的理論過程:
    get 'https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=' 獲取驗證碼
    get 'https://service.htsc.com.cn/service/login.jsp' 以便取得並記住cookies
    post  'https://service.htsc.com.cn/service/loginAction.do?method=login' 登錄
 */

vcurl = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=" + (Math.random());

r = function(callback) {
  return request.get({
    url: 'https://service.htsc.com.cn/service/login.jsp',
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36"
    },
    forever: true,
    jar: true
  }, function(e, r, body) {
    return callback(e, r.headers);

    /*
    if e?
      callback e
    else
      console.log 'get:',request
      callback null, request
     */
  });
};

obj = {
  req: function(callback) {
    return setTimeout((function() {
      return r(callback);
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
  var ip, login, mac, options, ref1, req, url;
  (ref1 = results.ipmac, ip = ref1.ip, mac = ref1.mac), vcode = results.vcode, req = results.req;
  url = 'https://service.htsc.com.cn/service/loginAction.do?method=login';
  options = {
    method: "POST",
    url: url,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36"
    },
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
  };

  /*
    如果登錄成功,body中會找到有 '欢迎' 兩個字:
    沒有就不成功,實測結果是,僅獲得web交易頁面文件而已
    不知道錯在哪裡
   */
  return login = function(options, callback) {
    return request(options, function(e, r, body) {
      if (err) {
        return console.error(e);
      } else {
        if ((body.indexOf('欢迎')) < 0) {
          return callback('登錄不成功', body);
        } else {
          return callback(null, body);
        }
      }
    });
  };

  /* test: fails 請去掉注釋運行測試
  login options, (err, body)->
    if err
      console.error err
    else
      console.log body
   */
});

//# sourceMappingURL=login.js.map
