# login ht
util = require 'util'
async = require 'async'
request = require 'request'
qs = require 'querystring'
vcode = require './getvcode'
hddInfo = require './hddInfo' #'ST9120817AS'
address = require './getaddress'
{userName,trdpwd,trdpwdEns,servicePwd} = require './.mainaccount'
{postheaders,getheaders}=require '../refs/experiments/options'
{fetchUrl, fetchStream,CookieJar} = require 'fetch'


delete postheaders.cookies

cookies = new CookieJar()
cookies.setCookie getheaders.cookies
oldcookies = cookies


url = 'https://service.htsc.com.cn/service/login.jsp'
fetchpage = (callback) ->
  fetchUrl url,
    {headers: getheaders
    method: 'GET'
    #cookies: cookies
    cookieJar: cookies },
    (err,meta, body) ->
      callback err,meta

#fetchpage (err, meta, body)->
#  console.log meta.cookieJar == oldcookies #, body.toString()

###
  採用request模塊,實現登錄的理論過程:
    get 'https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=' 獲取驗證碼
    get 'https://service.htsc.com.cn/service/login.jsp' 以便取得並記住cookies
    post  'https://service.htsc.com.cn/service/loginAction.do?method=login' 登錄
###

vcurl = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=#{Math.random()}"



r = (callback) ->
  request.get
    url: 'https://service.htsc.com.cn/service/login.jsp'
    headers: getheaders
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
  fet: (callback)-> setTimeout (-> fetchpage callback), 200
  req: (callback)-> setTimeout (-> r callback), 200
  vcode: (callback)-> setTimeout (-> vcode vcurl, callback), 200
  ipmac: (callback)-> setTimeout (-> address callback), 400
  #req: (callback)-> setTimeout (-> r callback), 200

async.parallel obj, (err,results)->
  {ipmac:{ip,mac}, vcode,req, fet} = results
  # 緊接著就登錄
  url = 'https://service.htsc.com.cn/service/loginAction.do?method=login'
  postheaders.cookies = cookies.cookies

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

  options =
    method: "POST"
    url: url
    headers: postheaders
    jar:true
    payload: serialize payload # "userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&macaddr=60:33:4B:09:BF:0F&hddInfo=#{hddInfo}&lipInfo=192.168.1.101+&CPU=QkZFQkZCRkYwMDAzMDY2MQ%3D%3D&PCN=U0RXTS0yMDEzMDkxNFNX&PI=QyxOVEZTLDYwLjAwMzg%3D&topath=null&accountType=1&userName=080300007199&servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode=#{vcode.trim()}"

  ###
    如果登錄成功,body中會找到有 '欢迎' 兩個字:
    沒有就不成功,實測結果是,僅獲得web交易頁面文件而已
    不知道錯在哪裡
  ###

  callback = (err,res, data)->
    if err
      console.error err
    else
      body = data.toString()
      if (body.indexOf '欢迎') < 0
        console.error res#.session.toString(), '登錄不成功'
        #return setTimeout(login(options, callback), 5000)
      else
        console.log res, body

  request options, callback
