/**
 * @file 测试入口文件
 * @author simmons8616(simmons0616@gmail.com)
 */

const path = require('path');
const fs = require('fs');
const express = require('express');
const handlebars = require('handlebars');
const weAccessMiddleware = require('../dist/index');
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
    weAccessMiddleware(
        {
            appId: 'wx46cefb4ba1541c71',
            appSecret: '6d65bdf7cebcf28fb9434fc15c6ebdbc'
        }
    )
);

app.get(
    '/',
    async function (req, res) {
        const tplStr = await getTplStr();
        const html = handlebars.compile(tplStr)(req.weAccessInfo);
        res
            .type('html')
            .send(html);
    }
);

app.listen(8886);
