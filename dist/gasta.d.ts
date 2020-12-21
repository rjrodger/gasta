declare function Gasta(): GastaImpl;
declare namespace Gasta {
    var intern: {
        read(tokens: any[]): any;
        ctx(outer: any, params?: string[] | undefined, args?: any[] | undefined): {
            [k: string]: any;
        };
        resolve(exp: any, ctx: any): Promise<any>;
    };
}
declare class GastaImpl {
    constructor(...rest: any[]);
}
declare const intern: {
    read(tokens: any[]): any;
    ctx(outer: any, params?: string[] | undefined, args?: any[] | undefined): {
        [k: string]: any;
    };
    resolve(exp: any, ctx: any): Promise<any>;
};
