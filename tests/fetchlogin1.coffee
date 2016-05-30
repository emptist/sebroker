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
waterfall = require 'run-waterfall'
parallel = require 'run-parallel'

cookies = new CookieJar()
#cookies.setCookie getheaders.cookies
oldcookies = cookies


url = 'https://service.htsc.com.cn/service/login.jsp'
cookieopt =
  headers: getheaders
  method: 'GET'
  cookieJar: cookies

fcookie = (callback) ->
  setTimeout ->
    fetchUrl url,cookieopt, (err,meta, body) ->
      callback err,meta.responseHeaders['set-cookie'].join(',')

vcode = (callback)-> setTimeout (-> vcode vcurl, callback), 200
ipmac = (callback)-> setTimeout (-> address callback), 400

waterfall [ fetchCookie, ipmac, vcode ], (err, results)->
  [cookie, mac, code] = results
