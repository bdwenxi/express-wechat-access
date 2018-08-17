# express-wechat-access

基于express的微信鉴权中间件

## 安装方式

```bash
$ yarn add express-wechat-access

$ npm install express-wechat-access
```

> 注：如果node版本 >= 7.6的话可以直接下载next版本（内部保留async和await API，不会做转换，性能会好一些）
```
$ yarn add express-wechat-access@next

$ npm install express-wechat-access@next
```

## 引入方式

```
const weAccessMiddleware = require('express-wechat-access');
```


## 使用方式

### 模板示例


> 注：当前测试模板引擎用的是handlebars，根据自己项目而定，ejs，jade等都可以


```
<div>
    <h1>
        微信鉴权测试
    </h1>
</div>
<script>
    /* eslint-disable */
    wx.config({
        debug: false,
        appId: '{{appid}}',
        timestamp: '{{timestamp}}',
        nonceStr: '{{nonceStr}}',
        signature: '{{signature}}',
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ]
    });

    wx.ready(function () {
        var link = location.href;

        wx.onMenuShareTimeline({
            title: document.title,
            link: link,
            // 分享icon
            imgUrl: 'https://xxx.com/file/B2C785DD9AF24CD09F1872A766166609',
            trigger: function (res) {
            },
            success: function (res) {
            },
            cancel: function (res) {
            },
            fail: function (res) {
            }
        });

        //分享给好友
        wx.onMenuShareAppMessage({
            title: document.title,
            desc: '',
            link: link,
            // 分享icon
            imgUrl: 'https://xxx.com/file/B2C785DD9AF24CD09F1872A766166609',
            type: 'link',
            dataUrl: '',
            success: function () {
            },
            cancel: function () {
            }
        });
    });
</script>
```

### js代码示例

```
const path = require('path');
const fs = require('fs');
const express = require('express');
const handlebars = require('handlebars');
// 引入微信鉴权中间件
const weAccessMiddleware = require('express-wechat-access');
const app = express();

function getTplStr() {
    const tplPath = path.join(__dirname, 'index.hbs');
    return new Promise(
        (resolve, reject) => {
            fs.readFile(
                tplPath,
                (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(data.toString());
                }
            );
        }
    );
}

app.use(
    // 使用微信鉴权中间件
    weAccessMiddleware(
        {
            // 根据自己申请的微信平台账号的appId填入
            appId: 'xxxxxxxx',
            // 根据自己申请的微信平台账号的appSecret填入
            appSecret: 'xxxxxxxxxxxxxxx',
            // 默认的获取access_token的地址
            accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
            // 默认的获取ticket门票的地址
            ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
            // 当前url的协议protocol
            https: true
        },
        e => {
            // 错误处理逻辑
            console.error(e);
        }
    )
);

app.get(
    '/',
    async function (req, res) {
        const tplStr = await getTplStr();
        // 通过req拿到微信鉴权的信息，通过不同的模板引擎渲染模板
        const html = handlebars.compile(tplStr)(req.weAccessInfo);
        res
            .type('html')
            .send(html);
    }
);

app.listen(8886);
```

## API

### weAccessMiddleware([options], errorHandler)

#### options

``` weAccessMiddleware() ``` 接收一个包含以下参数的options对象

##### appId

* 描述：第三方用户唯一凭证

* 类型：string

* 是否必须：是

* 默认值：无

##### appSecret

* 描述：第三方用户唯一凭证密钥

* 类型：string

* 是否必须：是

* 默认值：无

##### accessTokenUrl

* 描述：获取access_token的接口地址

* 类型：string

* 是否必须：否

* 默认值：https://api.weixin.qq.com/cgi-bin/token

##### ticketUrl

* 描述：获取ticket门票的接口地址

* 类型：string

* 是否必须：否

* 默认值：https://api.weixin.qq.com/cgi-bin/ticket/getticket

##### https

* 描述：当前url的协议protocol

* 类型：boolean

* 是否必须：否

* 默认值：false

#### errorHandler

``` function errorHandler(e) {} ``` 错误处理函数，接收一个Error实例作为参数

## 参考资料

> 以下是微信公众平台的相应文档

1. 微信JS-SDK说明文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
2. 获取access_token：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
3. 接口测试号申请(获取appId和appSecret)：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421137522
