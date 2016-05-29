
util = require 'util'
async = require 'async'
vcode = require './getvcode'
hddInfo = require './hddInfo' #'ST9120817AS'
address = require './getaddress'
{userName,trdpwd,trdpwdEns,servicePwd} = require './.mainaccount'
{postheaders,getheaders}=require '../refs/experiments/options'
{fetchUrl, fetchStream,CookieJar} = require 'fetch'
got = require('got')
path = require( 'path' )
fs   = require( 'fs' )
FormData =  require('form-data')



url = 'https://service.htsc.com.cn/service/login.jsp'
got(url)
  .then((res)-> return (cookies = res.headers['set-cookie']))
  .then((cookies)-> console.log cookies)
  .catch((error)->console.log error.response.headers)

#console.log cookies
###

form  = new FormData()
form.append accountType,1
form.append userName, userName
form.append servicePwd, servicePwd
form.append trdpwdEns, trdpwdEns
form.append trdpwd, trdpwd
form.append vcode, "#{vcode.trim()}"
form.append userType, 'jy'

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
    macaddr:'60:33:4B:09:BF:0F'
    hddInfo: "#{hddInfo}"
    lipInfo: "#{ip}"
    topath: null
    accountType: 1
    userName: userName
    servicePwd: servicePwd
    trdpwdEns: trdpwdEns
    trdpwd: trdpwd
    vcode: "#{vcode.trim()}"
    userType: 'jy'



  #console.log serialize payload

  options =
    method: "POST"
    url: url
    cookies: cookies
    #headers: postheaders
    cookieJar: cookies
    payload: serialize payload

  #curl =  "userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&macaddr=60:33:4B:09:BF:0F&hddInfo=#{hddInfo}&lipInfo=192.168.1.101+&CPU=QkZFQkZCRkYwMDAzMDY2MQ%3D%3D&PCN=U0RXTS0yMDEzMDkxNFNX&PI=QyxOVEZTLDYwLjAwMzg%3D&topath=null&accountType=1&userName=080300007199&servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode=#{vcode.trim()}"

  p = "         'userType': self.__user_type,
            'loginEvent': 1,
            'trdpwdEns': self.__encrypted_password,
            'macaddr': self.__mac_addr,
            'hddInfo': self.__harddisk_model,
            'lipInfo': self.__ip_addr,
            'topath': 'null',
            'accountType': 1,
            'userName': self.__account,
            'servicePwd': self.__service_password,
            'trdpwd': self.__encrypted_password,
            'vcode': self.__verify_code
   "
  callback = (err, meta, data)->
      if err
        console.error err
      else
        body = data.toString()
        if (body.indexOf '欢迎') < 0
          console.error meta.cookieJar.cookies ,body, '登錄不成功'
          #return setTimeout(login(options, callback), 5000)
        else
          console.log meta.cookieJar.cookies, body

  fetchUrl url, options, callback

###
###  採用fetch模塊,實現登錄的理論過程:
    get 'https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=' 獲取驗證碼
    get 'https://service.htsc.com.cn/service/login.jsp' 以便取得並記住cookies
    post  'https://service.htsc.com.cn/service/loginAction.do?method=login' 登錄

###
