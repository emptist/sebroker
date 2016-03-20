# login ht
util = require 'util'
async = require 'async'
{Client} = require 'node-rest-client'
c = new Client()


url = 'https://service.htsc.com.cn/service/login.jsp'
c.get url,(json, r) ->
    console.log json
    console.log r.headers
