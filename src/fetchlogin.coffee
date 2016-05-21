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

  options =
    method: "POST"
    url: url
    headers: postheaders
    cookieJar: cookies
    payload:"userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&macaddr=60:33:4B:09:BF:0F&hddInfo=#{hddInfo}&lipInfo=192.168.1.101+&CPU=QkZFQkZCRkYwMDAzMDY2MQ%3D%3D&PCN=U0RXTS0yMDEzMDkxNFNX&PI=QyxOVEZTLDYwLjAwMzg%3D&topath=null&accountType=1&userName=080300007199&servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode=#{vcode.trim()}"

  encodeURIComponent {
      loginEvent: 1
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
    }

  callback = (err, meta, data)->
      if err
        console.error err
      else
        body = data.toString()
        if (body.indexOf '欢迎') < 0
          console.error meta.cookieJar.cookies #,body, '登錄不成功'
          #return setTimeout(login(options, callback), 5000)
        else
          console.log meta.cookieJar.cookies, body

  fetchUrl url, options, callback


###  採用fetch模塊,實現登錄的理論過程:
    get 'https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=' 獲取驗證碼
    get 'https://service.htsc.com.cn/service/login.jsp' 以便取得並記住cookies
    post  'https://service.htsc.com.cn/service/loginAction.do?method=login' 登錄

###
