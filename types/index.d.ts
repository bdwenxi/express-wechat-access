import * as core from './core';

declare function weAccessMiddleware(
    options: Partial<core.IWeAccessMidOption>,
    errorHandler: (e: any) => {}
): core.IMiddleware;

declare namespace weAccessMiddleware {

    interface IWeAccessMidOption extends core.IWeAccessMidOption {}

    interface IWeAccessMiddleware extends core.IMiddleware {}
}

export = weAccessMiddleware;
