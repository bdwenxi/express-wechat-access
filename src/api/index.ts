/**
 * @file 请求api接口文件
 * @author simmons8616(simmons0616@gmail.com)
 */

import * as request from 'superagent';

import {IReqTokenParams, IReqTicketParams} from '../../types/core';

import {ILogErrorInfo} from '../../types/core';

/**
 * 获取access_token的api接口请求方法
 *
 * @param {string} url 请求url
 * @param {IReqTokenParams} params 请求入参
 * @return {Promise<string>}
 */
export function getTokenReqApi(url: string, params: IReqTokenParams, timeout: number, retry: number): Promise<string> {
    return new Promise(
        (resolve, reject) => {
            request
                .get(url)
                .query(params)
                .timeout({
                    deadline: timeout
                })
                .retry(retry)
                .then(
                    ({body}) => {
                        if (body.errcode) {
                            const logErrorInfo = <ILogErrorInfo>{
                                type: 'getDataFailed',
                                message: `获取微信access_token错误：${body.errmsg}`,
                                date: new Date()
                            };

                            return reject(logErrorInfo);
                        }

                        resolve(body.access_token);
                    }
                )
                .catch(
                    e => {
                        const logErrorInfo = <ILogErrorInfo>{
                            type: 'getDataFailed',
                            message: `获取微信api_ticket错误：network error`,
                            date: new Date(),
                            error: e
                        };

                        reject(logErrorInfo);
                    }
                );
        }
    );
}

/**
 * 获取api_ticket的api接口请求方法
 *
 * @param {string} url 请求url
 * @param {IReqTicketParams} params 请求入参
 * @return {Promise<string>}
 */
export function getTicketReqApi(url: string, params: IReqTicketParams, timeout: number, retry: number): Promise<string> {
    return new Promise(
        (resolve, reject) => {
            request
                .get(url)
                .query(params)
                .timeout({
                    deadline: timeout
                })
                .retry(retry)
                .then(
                    ({body}) => {
                        if (body.errcode) {
                            const logErrorInfo = <ILogErrorInfo>{
                                type: 'getDataFailed',
                                message: `获取微信api_ticket错误：${body.errmsg}`,
                                date: new Date()
                            };

                            return reject(logErrorInfo);
                        }

                        resolve(body.ticket);
                    }
                )
                .catch(
                    e => {
                        const logErrorInfo = <ILogErrorInfo>{
                            type: 'getDataFailed',
                            message: `获取微信api_ticket错误：network error`,
                            date: new Date(),
                            error: e
                        };

                        reject(logErrorInfo);
                    }
                );
        }
    );
}
