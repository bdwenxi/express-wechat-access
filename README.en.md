# express-wechat-access

Express-based wechat authentication middleware

## Installation

```bash
$ yarn add express-wechat-access

$ npm install express-wechat-access
```

> Note：when your node_version >= 7.6, you can install with @next tag
```
$ yarn add express-wechat-access@next

$ npm install express-wechat-access@next
```

## How to import

```
const weAccessMiddleware = require('express-wechat-access');
```


## Usage

### Template example


> Note: The current test template engine uses handlebars, you can depending on your project, ejs, jade, etc.


```
<div>
    <h1>
        Wechat authentication test
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
            // shared icon
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

        wx.onMenuShareAppMessage({
            title: document.title,
            desc: '',
            link: link,
            // shared icon
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

### Code example

```
const path = require('path');
const fs = require('fs');
const express = require('express');
const handlebars = require('handlebars');
// Import wechat authentication middleware
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
    // Use wechat authentication middleware
    weAccessMiddleware(
        {
            // Fill in the appId based on the wechat platform account you applied for.
            appId: 'xxxxxxxx',
            // Fill in according to the appSecret of the wechat platform account you applied for.
            appSecret: 'xxxxxxxxxxxxxxx',
            accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
            ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
            // protocol for the current url
            https: true
        },
        e => {
            // Write error handling logic
            console.error(e);
        }
    )
);

app.get(
    '/',
    async function (req, res) {
        const tplStr = await getTplStr();
        // Get the information of wechat authentication through req, and render the template through different template engines
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

``` weAccessMiddleware() ``` receives an options object with the following parameters

##### appId

* Description：Third-party user unique credentials

* Type：string

* Required：yes

* Default：none

##### appSecret

* Description：Third-party user unique credential key

* Type：string

* Required：yes

* Default：none

##### accessTokenUrl

* Description：Get the interface address of the access_token

* Type：string

* Required：no

* Default：https://api.weixin.qq.com/cgi-bin/token

##### ticketUrl

* Description：Get the interface address of the ticket

* Type：string

* Required：no

* Default：https://api.weixin.qq.com/cgi-bin/ticket/getticket

##### https

* Description：protocol for the current url

* Type：boolean

* Required：no

* Default：false

##### timeout

* 描述：request timeout (ms)

* 类型：number

* 是否必须：否

* 默认值：10000

##### retry

* 描述：request retry times

* 类型：number

* 是否必须：否

* 默认值：3

#### errorHandler

``` function errorHandler(e) {} ``` Error handling function, receiving an Error instance as a parameter

## Reference

> The following is the corresponding document of the WeChat public platform.

1. Wechat JS-SDK documentation：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
2. How to get access_token：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
3. How to apply the interface of the wechat test account  (get appId and appSecret)：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421137522
