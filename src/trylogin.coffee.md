# login

登錄就是給服務器發一個request,其方式是post,其內容是券商定的.
先嘗試一下,成功後再整飾代碼.
華泰的代碼是 function checkForm
用jquery 以ajax方式發送form到服務器

在 node.js in practice p271 Tech 76 Testing Auhenticated routes中有些相關內容,但還是
不懂.

see
https://www.haykranen.nl/2011/06/21/basic-http-authentication-in-node-js-using-the-request-module/
http://www.sitepoint.com/making-http-requests-in-node-js/
https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping


request需要好好學學,太常用了.它還可以填表.

這裡有個問題, 非順序執行的結果,何時出來不知道,要等結果出來才能走下一步,怎麼辦?這個問題很多人問過,
有幾種方法來解決,用Promise,或用一個庫,https://github.com/caolan/async
先試著用這個庫.
```
cnpm install aysnc --save
```
>#// an example using an object instead of an array
> javascript 比較繞人,我改成coffeescript:
```
obj =
  one: (callback)-> setTimeout (-> 這裡可做各種事; callback null, 1 ), 200)
  two: (callback)-> setTimeout (-> 這裡可做各種事; callback null, 2 ), 100)

async.parallel obj, (err, results)->
  #results is now equals to: {one: 1, two: 2}
```

    async = require 'async'
    request = require 'request'
    #ocr =  require 'ocr-by-image-url'
    vcode = require './getVCode'
    hddInfo = require './hddInfo.coffee.md' #'ST9120817AS'
    address = require 'address'

驗證碼是圖片的網址是變動的,所變動的只是ran= 後面的數字,前面不變.那個數字是隨機數.

    vcurl = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=#{Math.random()}"

以下採用上述方法來取得填寫登錄表所需的參數, 要求是給 callback傳 null, data這兩個參數,而我們
所用的address和getImageText都會這麼做,兩者都接受callback,後者,還要接受另一個參數,vcurl.
類似的情況都可以以此類推.
以下從圖片識別驗證碼,以及取本機一些數據:


    r = (callback) ->
      request.get
        url: 'https://service.htsc.com.cn/service/login.jsp'
        forever: true
        jar: true
        (e,r, body) ->
          if e? then callback e
          else
            callback null, request

    obj =
      vcode: (callback)-> setTimeout (-> vcode vcurl, callback), 200
      ipmac: (callback)-> setTimeout (-> address callback), 400
      req: (callback)-> setTimeout (-> r callback), 200

得到結果之後才能登錄,所以登錄過程寫在這async.parallel的回應function中:
1. 設置登錄 url 1. 填報數據
1. 登錄
似乎只有通過路由上網時,address這個庫才能取到mac地址.
以上vcode需要trim()之後去掉空格.而ipmac裡面有3個東西,所以以下用解析ipmac來取ip和mac
http://www.oschina.net/translate/web-scraping-with-node-js?print


    async.parallel obj, (err,results)->
        {ipmac:{ip,ipv4,mac}, vcode,req} = results
        # 緊接著就登錄
        url = 'https://service.htsc.com.cn/service/loginAction.do?method=login'
        headers =
          Origin: 'https://service.htsc.com.cn'
          Accept-Encoding: 'gzip, deflate'
          Host:"service.htsc.com.cn"
          Accept-Language: "en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4,zh-CN;q=0.2,en-GB;q=0.2"
          Upgrade-Insecure-Requests:"1"
          User-Agent:"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36"
          Content-Type: "application/x-www-form-urlencoded"
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
          Cache-Control: "max-age=0"
          Referer: "https://service.htsc.com.cn/service/login.jsp"
          Connection: "keep-alive"
          Content-Length: "336"
          DNT: "1"


        options =
          method: "POST"
          url: "https://service.htsc.com.cn/service/loginAction.do?method=login"
          httpVersion: "HTTP/1.1"
          headers: headers
          queryString:
            method: "login"
          forever: true
          jar: true
          userType: 'jy'
          loginEvent:1
          macaddr:'60:33:4B:09:BF:0F'
          hddInfo: "#{hddInfo}"
          lipInfo: "#{ip}"
          topath: null
          accountType: 1
          userName: '080300007199'
          servicePwd: '19660522'
          trdpwd: '196605'
          trdpwdEns: '196605'
          vcode: "#{vcode.trim()}"

        #request
        req options,(e,r, body)->
          if err then console.log e
          console.error r, body unless err



以上的運行結果是系統錯誤,因為我沒有掌握request的使用方法.
還是不行啊
準備嘗試 phantomjs
或 nightmare
https://azurelogic.com/posts/web-scraping-with-nightmare-js/
https://github.com/sunmoonlotus/nightmare
