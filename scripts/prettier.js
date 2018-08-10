/**
 * @file 优化代码格式脚本
 * @author simmons8616(simmons0616@gmail.com)
 */

const path = require('path');
const fs = require('fs');
const prettier = require('prettier');
const glob = require('glob');

const prettierCfgPath = path.resolve(__dirname, 'config', '.prettierrc.js');
const basicPath = path.resolve(__dirname, '..', 'dist');
const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json')).toString()
);
const banner = `/**
 * WeAccessMiddleware v${pkg.version}
 * ${pkg.repository.url}
 *
 * Copyright (c) 2017-2018
 * Released under the ${pkg.license} license
 */`;

function getDistFiles() {
    return new Promise(
        (resolve, reject) => {
            glob(
                '**/*.js',
                {
                    cwd: basicPath
                },
                (err, files) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(files);
                }
            );
        }
    );
}

prettier
    .resolveConfig(prettierCfgPath)
    .then(
        async options => {
            const files = await getDistFiles();

            if (files.length > 0) {
                files.forEach(
                    fileBasePath => {
                        const realPath = `${basicPath}/${fileBasePath}`;
                        const code = fs.readFileSync(realPath, 'utf8');
                        const formattedCode = prettier.format(code, options);
                        fs.writeFileSync(
                            realPath,
                            banner + '\n\n' + formattedCode
                        );
                    }
                );
            }

        }
    );
