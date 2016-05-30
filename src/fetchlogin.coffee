#http://stackoverflow.com/questions/14551194/how-are-parameters-sent-in-an-http-post-request

util = require 'util'
async = require 'async'
request = require 'request'
vcode = require './getvcode'
hddInfo = require './hddInfo' #'ST9120817AS'
address = require './getaddress'
{userName,trdpwd,trdpwdEns,servicePwd} = require './.mainaccount'
{postheaders,getheaders}=require '../refs/experiments/options'
{fetchUrl, fetchStream,CookieJar} = require 'fetch'
series = require 'run-series'

cookies = new CookieJar()
#cookies.setCookie getheaders.cookies
oldcookies = cookies


url = 'https://service.htsc.com.cn/service/login.jsp'
vcurl = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=#{Math.random()}"

cookieopt =
  headers: getheaders
  method: 'GET'
  cookieJar: cookies

fcookie = (callback) ->
  fetchUrl url,cookieopt, (err,meta, body) ->
    callback err, meta.responseHeaders['set-cookie'].join(',')

series [ fcookie, (callback)-> vcode vcurl, callback ], (err, results)->
  [cookie, code] = results

  # 以下代碼使用工具網站轉譯自 curl,故不需再試了,request庫有問題
  headers =
    'Origin': 'https://service.htsc.com.cn'
    'Accept-Encoding': 'gzip, deflate'
    'Accept-Language': 'en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4,zh-CN;q=0.2,en-GB;q=0.2'
    'Upgrade-Insecure-Requests': '1'
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36'
    'Content-Type': 'application/x-www-form-urlencoded'
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    'Cache-Control': 'max-age=0'
    'Referer': 'https://service.htsc.com.cn/service/login.jsp'
    'Connection': 'keep-alive'
    'DNT': '1'
    'Cookie': cookie
    #'Cookie': '__utma=249860889.1993829779.1432911006.1440648966.1446029513.4; __utmz=249860889.1432911006.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); JSESSIONID=1QTTW2cXpt8CykHQZFp1Vn2m225TZ7dTkqKpT7LWrG2Khc05ZL3s!979201071; SESSION_COOKIE=61781'

  #console.log cookie,code

  #dataString = 'userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&macaddr=60-33-4B-09-BF-0F&hddInfo=ST9120817AS&lipInfo=192.168.0.104&topath=null&accountType=1&userName=080300007199&servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode='+code
  dataString = 'userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&macaddr=60-33-4B-09-BF-0F&hddInfo=ST9120817AS&lipInfo=192.168.0.104+&CPU=QkZFQkZCRkYwMDAzMDY2MQ%3D%3D&PCN=U0RXTS0yMDEzMDkxNFNX&PI=QyxOVEZTLDYwLjAwMzg%3D&topath=null&accountType=1&userName=080300007199&servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode='+code
  options =
    url: 'https://service.htsc.com.cn/service/loginAction.do?method=login'
    method: 'POST'
    headers: headers
    body: dataString
    cookieJar: cookies

  callback = (error, response, body) ->
    #console.log error,response,body
    if error?
      console.log error
    else
      if (body.indexOf '欢') > 0
        console.log 'ok ', body
      else
        console.log response.finalUrl
    return

  #request options, callback
  fetchUrl options.url, options, callback









###
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
