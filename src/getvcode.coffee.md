## 驗證碼


### 圖片url

captchaImage參閱 華泰代碼:loginAction.do.jade 和chrome解析結果
service.htsc.com.cn.har.json

> //更换验证码
function changeVcode(){
document.getElementById("captchaImage").src = "/service/pic/verifyCodeImage.jsp?ran="+Math.random();


### 讀取驗證碼

使用: ocr-by-image-url (based on  node-tesseract, based on tesseract)
```
brew install tesseract --all-languages
cnpm install node-tesseract
cnpm install ocr-by-image-url
```

> 官方說明使用方法
```
ocr.getImageText('http://image.com/cat-poem.png', function(error, text){
    console.log(text.trim());
});
// With proxy
var proxy = 'http://user:pass@proxy.server.com:3128';
ocr.getImageText('http://image.com/cat.png', proxy, function(error, text){
    console.log(text.trim);
});
```


    ocr =  require 'ocr-by-image-url'

    url = "https://service.htsc.com.cn/service/pic/verifyCodeImage.jsp?ran=#{Math.random()}"
    vcode = (viurl, callback)->
      ocr.getImageText viurl, (err, text)->
        if err
          return vcode viurl, callback

        code = text.trim()
        # 此處可做篩選,已知驗證碼只含英文字母或數字,並且目前為4位數字
        unless /^\w{4}$/.test code 
          return vcode viurl, callback
        return callback null, code
    ###
    vcode url, (err, code)->
      console.log code
    ###
    module.exports = vcode
