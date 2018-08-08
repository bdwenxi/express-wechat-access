/**
 * @file 微信鉴权常量文件
 * @author simmons8616(simmons0616@gmail.com)
 */

import {IWeAccessMidOption} from '../../types/core';

export const defaultWeAccessOption = {
    accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
    ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
} as IWeAccessMidOption;
