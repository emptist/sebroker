#http://stackoverflow.com/questions/14551194/how-are-parameters-sent-in-an-http-post-request

util = require 'util'
async = require 'async'
#qs = require 'querystring'
vcode = require './getvcode'
hddInfo = require './hddInfo' #'ST9120817AS'
address = require './getaddress'
{userName,trdpwd,trdpwdEns,servicePwd} = require './.mainaccount'
{postheaders,getheaders}=require '../refs/experiments/options'
needle = require 'needle'
{fetchUrl, fetchStream,CookieJar} = require 'fetch'


delete postheaders.cookies

cookies = new CookieJar()
cookies.setCookie getheaders.cookies
oldcookies = cookies

options =
  headers: getheaders
  method: 'GET'
  #cookies: cookies
  cookieJar: cookies

url = 'https://service.htsc.com.cn/service/login.jsp'
fetchpage = (callback) ->
  fetchUrl url,options,(err, meta, body) ->
    if err?
      console.error err
      return
    else
      callback err, meta.cookieJar.cookies

fetchpage (err, meta)->
  console.log  "ok"#meta #.cookieJar == oldcookies #, body.toString()


url = 'https://service.htsc.com.cn/service/login.jsp'
options =
  headers: getheaders
  method: 'GET'
  cookies: cookies.cookies
  parse_cookies: true
  follow_set_cookies: true


getpage = (callback) ->
  needle.get url,options,(err, resp, body) ->
    if err?
      callback err
    else
      #console.log resp.cookies
      callback err,resp

#getpage (resp)->
#  console.log resp.cookies #Jar == oldcookies #, body.toString()

##

vcurl = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=#{Math.random()}"

obj =
  fet: (callback)-> setTimeout (-> fetchpage callback), 400
  req: (callback)-> setTimeout (-> getpage callback), 400
  vcode: (callback)-> setTimeout (-> vcode vcurl, callback), 400
  ipmac: (callback)-> setTimeout (-> address callback), 400

async.parallel obj, (err,results)->
  #{ipmac:{ip,mac}, vcode, req, fet} = results
  {ipmac:{ip,mac}, vcode} = results


  # 緊接著就登錄
  cookies = cookies.cookies
  postheaders.cookies = cookies
  console.log vcode.trim(),cookies

  url = 'https://service.htsc.com.cn/service/loginAction.do?method=login'

  options =
    method: "POST"
    url: url
    headers: postheaders
    cookies: cookies
    parse_cookies: true
    follow_set_cookies: true

  p1 = "userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&"
  p2 = "macaddr=60:33:4B:09:BF:0F&hddInfo=#{hddInfo}&lipInfo=#{ip}&"
  p3 = "CPU=QkZFQkZCRkYwMDAzMDY2MQ%3D%3D&PCN=U0RXTS0yMDEzMDkxNFNX&PI=QyxOVEZTLDYwLjAwMzg%3D&"
  p4 = "topath=null&accountType=1&userName=080300007199&"
  p5 = "servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode=#{vcode.trim()}"

  #payload = "#{p1}#{p2}#{p4}#{p5}"

  serialize = (obj) ->
   str = []
   for p,v of obj
    if obj.hasOwnProperty(p)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
   str.join("&")

  payload =
    loginEvent: 1
    trdpwdEns: 19660522#trdpwdEns
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

  callback = (err, resp, body)->
    if err
      console.error err
    else
      #body = data.toString()
      if (body.indexOf '欢迎') < 0
        console.error resp.cookies,body, '登錄不成功'
        #return setTimeout(login(options, callback), 5000)
      else
        console.log resp.cookies, body

  needle.post url, options, serialize(payload), callback
  #needle.post url, payload, options, callback
####

###  採用fetch模塊,實現登錄的理論過程:
    get 'https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=' 獲取驗證碼
    get 'https://service.htsc.com.cn/service/login.jsp' 以便取得並記住cookies
    post  'https://service.htsc.com.cn/service/loginAction.do?method=login' 登錄

###
