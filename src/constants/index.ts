/**
 * @file 微信鉴权常量文件
 * @author simmons8616(simmons0616@gmail.com)
 */

import {IWeAccessMidOption} from '../../types/core';

export const defaultWeAccessOption: IWeAccessMidOption = {
    appId: 'wx6578691d5e747367',
    appSecret: 'df02847b2eb5b4aa42ff7bb0f9a9cabb',
    accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
    ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
};
