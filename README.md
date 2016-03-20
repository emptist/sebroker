# sebroker
(web) api for brokers

## 支持券商
目前先支持華泰

## 參考項目
Python版本:
https://github.com/shidenggui/easytrader

## 配置文件
為點文件:
lib/.mainaccount.js

```javascript
module.exports ={
  userName: '08030000****',//資金賬號
  trdpwd: '******', // 交易密碼
  trdpwdEns: '******', // 加密交易密碼,不加密照樣登錄
  servicePwd: '******' // 通訊密碼
};
```
## 項目狀態
初期開發.
目前登錄華泰尚不成功,主要是不太懂 request module 使用技巧.
待登錄成功之後再逐步開發查詢和委託功能

## Session 問題
華泰web交易平台使用Session/Cookies來保持登錄狀態,有關的技術:

http://alexehrnschwender.com/2013/07/client-side-auth-session-mgmt-backbone-node/
https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
http://stackoverflow.com/questions/10291000/persisting-a-cookie-based-session-over-node-http-proxy
https://hacks.mozilla.org/2012/12/using-secure-client-side-sessions-to-build-simple-and-scalable-node-js-applications-a-node-js-holiday-season-part-3/

## 所需支持庫
讀取驗證碼需手工安裝 tesseract.
因使用 ocr-by-image-url (based on  node-tesseract, based on tesseract) 須另行安裝
tesseract, 方法如下:

```bash
brew install tesseract #--all-languages  # on Mac,先簡單安裝,如果不能識別,則加全語言
```
識別驗證碼在getvcode中實現經實測成功,可將文件末測試部分的注釋去掉進行實測.

附: 官方說明其他使用方法
```javascript
ocr.getImageText('http://image.com/cat-poem.png', function(error, text){
    console.log(text.trim());
});
// With proxy
var proxy = 'http://user:pass@proxy.server.com:3128';
ocr.getImageText('http://image.com/cat.png', proxy, function(error, text){
    console.log(text.trim);
});
```
