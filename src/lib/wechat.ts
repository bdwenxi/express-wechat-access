/**
 * @file 微信鉴权服务模块
 * @author simmons8616(simmons0616@gmail.com)
 */

// 引入第三方模块
import * as cache from 'memory-cache';

// 导入接口api
import {
    getTokenReqApi,
    getTicketReqApi
} from '../api';
// 导入工具类
import {
    createNoncestr,
    transformSha1,
    getCurrentTimestamp
} from '../util';

import {
    IMiddleware,
    IReqTicketParams,
    IReqTokenParams,
    IWeChatOption,
    IWeAccessResult
} from '../../types/core';

let application: IMiddleware = {} as IMiddleware;

/**
 * 获取微信鉴权的所有信息
 *
 * @return {Promise<IWeAccessResult>}
 */
application.getSignatureInfo = async function (options: IWeChatOption): Promise<IWeAccessResult> {
    try {
        // 获取apiTicket
        const apiTicket = await this.getApiTicket(options);
        // 产出10位的时间戳字符串
        const timestamp = getCurrentTimestamp();
        // 产出随机字符串
        const nonceStr = createNoncestr();
        // 当前页面url
        const url = options.url;
        const signatureStr = `jsapi_ticket=${apiTicket}&noncestr=${nonceStr}`
            + `&timestamp=${timestamp}&url=${url}`;
        // 通过sha1加密后的签名信息
        const signature = transformSha1(signatureStr);

        return Promise.resolve(
            {
                appid: options.appId,
                nonceStr,
                timestamp,
                signature
            }
        );
    }
    catch (logErrorInfo) {
        return Promise.reject(logErrorInfo);
    }
};

/**
 * 异步函数，获取access_token
 *
 * @return {Promise<string>}
 */
application.getAccessToken = async function (options: IWeChatOption): Promise<string> {
    let accessToken: string = cache.get('access-token');

    if (!!accessToken) {
        return Promise.resolve(accessToken);
    }

    const params: IReqTokenParams = {
        grant_type: 'client_credential',
        appid: options.appId,
        secret: options.appSecret
    };

    try {
        accessToken = await getTokenReqApi(options.accessTokenUrl, params);
        cache.put('access-token', accessToken, 7200 * 1000);
        return Promise.resolve(accessToken);
    }
    catch (logErrorInfo) {
        return Promise.reject(logErrorInfo);
    }
};

/**
 * 异步函数，获取api_ticket
 *
 * @return {Promise<string>}
 */
application.getApiTicket = async function (options: IWeChatOption) {
    let apiTicket = cache.get('api-ticket');

    if (!!apiTicket) {
        return Promise.resolve(apiTicket);
    }

    try {
        const accessToken = await this.getAccessToken(options);
        const params: IReqTicketParams = {
            type: 'jsapi',
            access_token: accessToken
        };

        apiTicket = await getTicketReqApi(options.ticketUrl, params);
        cache.put('api-ticket', accessToken, 7200 * 1000);
        return Promise.resolve(apiTicket);
    }
    catch (logErrorInfo) {
        return Promise.reject(logErrorInfo);
    }
};

export default application;
module.exports = application;
