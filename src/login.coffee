# login ht
util = require 'util'
async = require 'async'
request = require 'request'
qs = require 'querystring'
#ocr =  require 'ocr-by-image-url'
vcode = require './getvcode'
hddInfo = require './hddInfo.coffee.md' #'ST9120817AS'
address = require './getaddress'
{userName,trdpwd,trdpwdEns,servicePwd} = require './.mainaccount'

vcurl = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=#{Math.random()}"



r = (callback) ->
  request.get
    url: 'https://service.htsc.com.cn/service/login.jsp'
    headers:
      "User-Agent":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36"
    forever: true
    jar: true
    (e,r, body) ->
      #console.log r.headers
      callback e,r.headers

      ###
      if e?
        callback e
      else
        console.log 'get:',request
        callback null, request
      ###

obj =
  vcode: (callback)-> setTimeout (-> vcode vcurl, callback), 200
  ipmac: (callback)-> setTimeout (-> address callback), 400
  req: (callback)-> setTimeout (-> r callback), 200

async.parallel obj, (err,results)->
  {ipmac:{ip,mac}, vcode,req} = results
  # 緊接著就登錄
  url = 'https://service.htsc.com.cn/service/loginAction.do?method=login'

  options =
    method: "POST"
    url: url
    headers:
      "User-Agent":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36"
    loginEvent:1
    topath: null
    accountType: 1
    userType: 'jy'
    userName: userName
    trdpwd: trdpwd
    trdpwdEns: trdpwdEns
    servicePwd: servicePwd
    macaddr:'60:33:4B:09:BF:0F'
    lipInfo: "#{ip}"
    vcode: "#{vcode.trim()}"
    hddInfo: "#{hddInfo}"
    #queryString:
      #method: "login"
    #forever: true
    #jar: true

  login = (options, callback)->
    request options, (e,r, body)->
      if err then console.error e
      if (body.indexOf '欢迎')<0
        console.log 'not yet...'
        return setTimeout login(options, callback), 5000
      callback null, body

  #request
  login options, (e,b)->
    console.log b
