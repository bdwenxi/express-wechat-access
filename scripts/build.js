/**
 * @file 生产环境构建脚本文件
 * @author simmons8616(simmons0616@gmail.com)
 */

// 引入node模块
const fs = require('fs');
const path = require('path');
// 引入第三方模块
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
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

/**
 * 获取输出文件的配置信息，便于rollup进行编译
 *
 * @param {string} moduleName 对外暴露的模块名称
 * @param {string} format 格式化类型
 * @return {*}
 */
const getProRollUpConfig = (moduleName, format) => {
    const basicConfig = {
        input: './src/index.ts',
        output: {
            file: './dist/index.js',
            format,
            name: moduleName
        },
        plugins: [
            commonjs()
        ]
    };
    const basicTsConfig = {
        useTsconfigDeclarationDir: true,
        // 这个插件默认typescript版本是1.8.9，所以更改引用本地的2.9.2版本
        typescript: require('typescript')
    };

    if (format === 'cjs') {
        basicConfig.plugins.unshift(
            typescript(
                {
                    ...basicTsConfig,
                    tsconfigOverride: {
                        compilerOptions: {
                            module: 'es2015'
                        }
                    }
                }
            )
        );
    }
    else {
        basicConfig.output.file = './dist/index.esm.js';
        basicConfig.plugins.unshift(
            typescript(
                {
                    ...basicTsConfig,
                    tsconfigOverride: {
                        compilerOptions: {
                            target: 'esnext',
                            module: 'es2015'
                        }
                    }
                }
            )
        );
    }
    return basicConfig;
};

/**
 * 异步函数，输出编译后文件方法
 *
 * @param {Object} config 输出文件的配置信息
 */
async function outputDistFile(config) {
    try {
        const bundle = await rollup.rollup(config);
        const output = await bundle.generate(config);
        const outputCode = output.code;
        const filePath = config.output.file;

        // 如果dist目录不存在，生成dist目录
        if (!fs.existsSync('dist')) {
            fs.mkdirSync('dist');
        }

        fs.writeFileSync(filePath, banner + '\n\n' + outputCode);
    }
    catch (e) {
        console.error(e);
    }
}

/**
 * 异步函数，构建流程方法（包括选择输出文件类型，输出编译后文件操作）
 */
function build() {
    const configs = ['es', 'cjs'].map(
        format => getProRollUpConfig('WeAccessMiddleware', format)
    );
    configs.forEach(outputDistFile);
}

// 开始构建流程
build();
