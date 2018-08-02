/**
 * @file 微信鉴权工具类文件
 * @author simmons8616(simmons0616@gmail.com)
 */

// 引入NodeJs基础模块
import * as crypto from 'crypto';

/**
 * 创建随机字符串
 *
 * @return {string}
 */
export function createNoncestr(): string {
    return Math.random().toString(36).substring(2, 15);
}

/**
 * 给传入数据转换成sha1加密的形式
 *
 * @param {string} data 需要加密的字符串数据
 * @return {string}
 */
export function transformSha1(data: string): string {
    const hash = crypto.createHash('sha1');
    hash.update(data);
    return hash.digest('hex');
}

/**
 * 获取当前时间戳
 *
 * @return {string}
 */
export function getCurrentTimestamp(): string {
    return parseInt(Date.now() / 1000 + '') + '';
}
