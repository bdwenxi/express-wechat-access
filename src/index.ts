/**
 * @file 微信鉴权中间件
 * @author zhangwenxi(zhangwenxi@baidu.com)
 */

import {EventEmitter} from 'events';
import weAccessLib from './lib/wechat';
import {defaultWeAccessOption as dftOption} from './constants';
import merge from 'merge-descriptors';

import {
    IWeAccessMidOption,
    IMiddleware,
    IWeAccessResult
} from '../types/core';

function weAccessMiddleware(options: Partial<IWeAccessMidOption> = {}, errorHandler = () => {}): IMiddleware {
    let mid: IMiddleware = function (req, _res, next) {
        // 协议根据传入的https字段来配
        const protocol = options.https ? 'https' : 'http';
        // 定义当前的url地址（微信鉴权的时候需要用）
        const url = `${protocol}://${req.headers.host}${req.url}`;
        const params = {
            url,
            appId: options.appId || dftOption.appId,
            appSecret: options.appSecret || dftOption.appSecret,
            accessTokenUrl: options.accessTokenUrl || dftOption.accessTokenUrl,
            ticketUrl: options.ticketUrl || dftOption.ticketUrl
        };

        mid.getSignatureInfo(params)
            .then(
                (signatureInfo: IWeAccessResult) => {
                    // 把微信鉴权的信息注入到request中，便于每个路由获取并注入到对应的hbs模板中
                    req.weAccessInfo = signatureInfo;
                    next();
                }
            )
            .catch(
                e => {
                    mid.emit('error', e);
                    next();
                }
            );
    } as IMiddleware;

    merge(mid, EventEmitter.prototype, false);
    merge(mid, weAccessLib, false);

    mid.on('error', errorHandler);

    return mid;
}

export default weAccessMiddleware;
