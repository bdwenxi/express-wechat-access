/// <reference types="node" />
/// <reference types="express" />

import * as http from 'http';
import {EventEmitter} from 'events';
import {Response, NextFunction} from 'express';

export interface IReqTokenParams {
    grant_type: string,
    appid: string,
    secret: string
}

export interface IReqTicketParams {
    type: string,
    access_token: string
}

export interface IWeAccessResult {
    // 以下字段不是必须的，不是每个页面都走微信鉴权
    appid?: string,
    nonceStr?: string,
    timestamp?: string,
    signature?: string
}

export interface IWeAccessMidOption {
    accessTokenUrl: string,
    ticketUrl: string,
    appId: string,
    appSecret: string,
    https?: boolean
}

export interface IWeChatOption extends IWeAccessResult, IWeAccessMidOption {
    url?: string
}


export interface IMiddleware extends EventEmitter, Function {
    (req: any, res: Response | http.ServerResponse, next: NextFunction): any;

    getSignatureInfo(options: IWeChatOption): Promise<IWeAccessResult>;

    getAccessToken(options: IWeChatOption): Promise<string>;

    getApiTicket(options: IWeChatOption): Promise<string>;
}
