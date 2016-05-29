#http://stackoverflow.com/questions/14551194/how-are-parameters-sent-in-an-http-post-request

util = require 'util'
async = require 'async'
#qs = require 'querystring'
vcode = require './getvcode'
hddInfo = require './hddInfo' #'ST9120817AS'
address = require './getaddress'
{userName,trdpwd,trdpwdEns,servicePwd} = require './.mainaccount'
{postheaders,getheaders}=require '../refs/experiments/options'
{fetchUrl, fetchStream,CookieJar} = require 'fetch'


delete postheaders.cookies

cookies = new CookieJar()
#cookies.setCookie getheaders.cookies
oldcookies = cookies


url = 'https://service.htsc.com.cn/service/login.jsp'
fetchpage = (callback) ->
  fetchUrl url,
    {headers: getheaders
    method: 'GET'
    cookieJar: cookies },
    (err,meta, body) ->
      callback err,meta,body

#fetchpage (err, meta, body)->
#  console.log meta.cookieJar == oldcookies #, body.toString()




vcurl = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=#{Math.random()}"

obj =
  req: (callback)-> setTimeout (-> fetchpage callback), 200
  vcode: (callback)-> setTimeout (-> vcode vcurl, callback), 200
  ipmac: (callback)-> setTimeout (-> address callback), 400
  #req: (callback)-> setTimeout (-> fetchpage callback), 200

async.parallel obj, (err,results)->
  {ipmac:{ip,mac}, vcode,req} = results
  # 緊接著就登錄

  url = 'https://service.htsc.com.cn/service/loginAction.do?method=login'

  serialize = (obj) ->
   str = []
   for p,v of obj
    if obj.hasOwnProperty(p)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
   str.join("&")

  payload =
    loginEvent: 1
    trdpwdEns: trdpwdEns
    macaddr:'60:33:4B:09:BF:0F'
    hddInfo: "#{hddInfo}"
    lipInfo: "#{ip}"
    topath: null
    accountType: 1
    userName: userName
    servicePwd: servicePwd
    trdpwd: trdpwd
    vcode: "#{vcode.trim()}"
    userType: 'jy'



  console.log serialize payload
