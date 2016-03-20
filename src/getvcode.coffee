### 驗證碼
###

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

module.exports = vcode

### tested
vcode url, (err, code)->
  console.log code unless err?
###
