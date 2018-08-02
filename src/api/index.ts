/**
 * @file 请求api接口文件
 * @author simmons8616(simmons0616@gmail.com)
 */

import * as request from 'superagent';

import {IReqTokenParams, IReqTicketParams} from '../../types/core';

/**
 * 获取access_token的api接口请求方法
 *
 * @param {string} url 请求url
 * @param {IReqTokenParams} params 请求入参
 * @return {Promise<string>}
 */
export function getTokenReqApi(url: string, params: IReqTokenParams): Promise<string> {
    return new Promise(
        (resolve, reject) => {
            request
                .get(url)
                .query(params)
                .then(
                    ({body}) => {
                        resolve(body.access_token);
                    }
                )
                .catch(
                    e => reject(e)
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
export function getTicketReqApi(url: string, params: IReqTicketParams): Promise<string> {
    return new Promise(
        (resolve, reject) => {
            request
                .get(url)
                .query(params)
                .then(
                    ({body}) => {
                        resolve(body.ticket);
                    }
                )
                .catch(
                    e => reject(e)
                );
        }
    );
}
