import * as core from './core';

declare namespace weAccessMiddleware {
    interface IWeAccessMidOption extends core.IWeAccessMidOption {}
}

declare module 'wechat-access-middleware' {
    export = weAccessMiddleware;
}
