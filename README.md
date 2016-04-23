# sebroker
(web) api for brokers

## 支持券商
目前擬先支持華泰

## 項目狀態
開發初期.目前登錄券商尚不成功.

主要是node不熟悉,同時不太懂 request module 的使用.不知道登錄不成功原因所在.
所需提供的信息應該都足夠了, Python 版本登錄和使用都沒有問題.

待登錄成功之後再逐步開發查詢和委託功能.

## 開發測試
本項目是通過登錄華泰web交易頁面,然後用開發工具分析network那部分獲得相關的接口.目前因考慮開發方便未獨立成配置文件,相關網址暫時混在 `lib/login`代碼中.

目前沒有用mocha和gulp來寫測試模塊.但有簡單測試程序.

### 文件說明
本項目是用coffeescript寫的,源代碼在 src/ 下,再編譯成Javascript, 代碼在 lib/ 下.
根目錄下的 index.js 暫時無用.


### 安裝 tesseract 庫
讀取驗證碼需手工安裝 tesseract.
因使用 ocr-by-image-url (based on  node-tesseract, based on tesseract) 須另行安裝 tesseract, 方法如下:

```bash
$ # on Mac
$ # 先簡單安裝,如果不能識別,則加全語言
$ brew install tesseract #--all-languages  
```
### 安裝所需模塊

```bash
$ cd sebroker
$ npm install
```
將安裝以下模塊:
```
"address": "^1.0.0",
"async": "^2.0.0-rc.1",
"ocr-by-image-url": "0.0.1",
"querystring": "^0.2.0",
"request": "^2.69.0"
```
詳見 package.json

### 模塊測試

#### 測試驗證碼識別(沒有問題)
識別驗證碼在`lib/getvcode`中實現經實測成功,可將文件末測試部分的注釋去掉進行實測.

#### 測試取得地址等數據(沒有問題)
文件為 `lib/getaddress`

#### 測試hdd硬盤信息(沒有問題)
該信息為手工查得,在文件 `lib/hddinfo` 中.
似乎無用,不影響登錄.

#### 登錄測試(不成功)

##### 登錄過程說明
採用 `request` 模塊,實現登錄的理論過程:
  - get 'https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=' 獲取驗證碼
  - get 'https://service.htsc.com.cn/service/login.jsp' 以便取得並記住cookies
  - post  'https://service.htsc.com.cn/service/loginAction.do?method=login' 登錄

##### 設置配置文件
先設置配置文件,再測試登錄.

配置文件為點文件,路徑應為:
`./lib/.mainaccount.js`

其內容為:
```javascript
module.exports ={
  userName: '08030000****',//資金賬號
  trdpwd: '******', // 交易密碼
  trdpwdEns: '******', // 加密交易密碼,不加密照樣登錄
  servicePwd: '******' // 通訊密碼
};
```

##### 測試登錄
去掉文件 `lib/login` 末尾的注釋,即可測試

```bash
$ cd lib
$ node login
```
登錄不成功主要是不懂相關知識,所以request的使用沒有頭緒,代碼是拼湊的,不明所以然,所以比較亂.也不知道錯在哪了.

### 附:
#### 參考項目
Python版本:
https://github.com/shidenggui/easytrader

#### Session/Cookies 相關討論
華泰web交易平台使用Session/Cookies來保持登錄狀態,有關的技術討論備查:

http://alexehrnschwender.com/2013/07/client-side-auth-session-mgmt-backbone-node/
https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
http://stackoverflow.com/questions/10291000/persisting-a-cookie-based-session-over-node-http-proxy
https://hacks.mozilla.org/2012/12/using-secure-client-side-sessions-to-build-simple-and-scalable-node-js-applications-a-node-js-holiday-season-part-3/

#### ocr-by-image-url 其他使用方法
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


# misc
https://coderwall.com/p/9cifuw/scraping-web-pages-using-node-js-using-request-promise


# request enhancement
https://www.npmjs.com/package/easy-api-request
https://www.npmjs.com/package/request-cookies
https://www.npmjs.com/package/scraper-request
https://www.npmjs.com/package/client-request
https://www.npmjs.com/package/retry-request
https://www.npmjs.com/package/oauth-request
https://github.com/FGRibreau/node-request-retry/blob/master/package.json
