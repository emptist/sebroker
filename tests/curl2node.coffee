request = require('request')
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
  'Cookie': '__utma=249860889.1993829779.1432911006.1440648966.1446029513.4; __utmz=249860889.1432911006.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); JSESSIONID=1QTTW2cXpt8CykHQZFp1Vn2m225TZ7dTkqKpT7LWrG2Khc05ZL3s!979201071; SESSION_COOKIE=61781'
dataString = 'userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&macaddr=00-1B-B1-28-38-26&hddInfo=5VEWYCT6&lipInfo=192.168.1.101+&CPU=QkZFQkZCRkYwMDAzMDY2MQ%3D%3D&PCN=U0RXTS0yMDEzMDkxNFNX&PI=QyxOVEZTLDYwLjAwMzg%3D&topath=null&accountType=1&userName=080300007199&servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode=e554'
options = 
  url: 'https://service.htsc.com.cn/service/loginAction.do?method=login'
  method: 'POST'
  headers: headers
  body: dataString

callback = (error, response, body) ->
  if !error and response.statusCode == 200
    console.log body
  return

request options, callback
