/*
  MIT License,
  Copyright (c) 2020, Richard Rodger and other contributors.
*/
'use strict';
module.exports = Gasta;
function Gasta() {
    return new GastaImpl(...arguments);
}
class GastaImpl {
    constructor(...rest) { }
}
const intern = {
    read(tokens) {
        let list = [];
        if (0 === tokens.length) {
            // error?
            return list;
        }
        let token = tokens.shift();
        if ('(' === token) {
            while (')' !== tokens[0]) {
                list.push(intern.read(tokens));
            }
            tokens.shift();
            return list;
        }
        else {
            if (')' === token) {
                // error?
                return list;
            }
            else {
                return token;
            }
        }
    },
    ctx(outer, params, args) {
        let inner = Object.create(outer !== null && outer !== void 0 ? outer : null);
        if (params && args) {
            params.forEach((p, i) => inner[p] = args[i]);
        }
        return inner;
    },
    async resolve(exp, ctx) {
        // console.log('R', exp)
        let exptype = typeof exp;
        if ('string' === exptype) {
            return ctx[exp];
        }
        else if (exptype === 'number') {
            return exp;
        }
        /*
        else if (exptype === 'function') {
          return exp;
        }
        */
        else {
            let subs = [];
            for (let expI = 0; expI < exp.length; expI++) {
                let sub = exp[expI];
                sub = 'function' === typeof (sub) ? sub : await intern.resolve(sub, ctx);
                let n = sub && sub.n;
                // fixed param functions
                if ('function' === typeof (sub) &&
                    sub.n &&
                    (0 > expI || sub.n + 1 < exp.length)) {
                    let args = exp.slice(expI + 1, expI + 1 + n);
                    sub =
                        await intern.resolve([sub, ...args], ctx);
                    // console.log('N', expI, n, sub, args)
                    expI += n;
                }
                subs.push(sub);
            }
            // console.log('C', subs)
            if ('function' === typeof (subs[0])) {
                return await subs[0].apply(ctx, subs.slice(1));
            }
            else {
                return subs;
            }
        }
    }
};
Gasta.intern = intern;
//# sourceMappingURL=gasta.js.map