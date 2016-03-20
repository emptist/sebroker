## 取得本機mac地址
用一個address庫來解決. 嘗試過其他庫不靈.此庫也需要在經過路由的情況下才能取得mac.

```
cnpm install address --save
```

由於這兩個地址可以不變,有時候也沒有用路由器,故試圖寫到文件中保存起來備用.



    # 若不使用config文件 只需改為 false
    useconfig = true

    macaddress = require 'address'
    fs = require 'fs'
    util = require 'util'

    ga = (callback)->
      fn = './.mac.json'
      if useconfig and fs.existsSync fn
        callback null, require fn
      else
        macaddress (err, data) ->
          callback err, data
          unless not useconfig or err?
            fs.writeFile fn, (JSON.stringify data), (err)->
              if err
                console.error err
              else
                util.log 'written .mac.json'

    module.exports = ga

    ### tested:
    ga (err, data)->
      {ip,mac} = data
      console.log data, "ip is #{ip}, mac is #{mac}"
    ###
