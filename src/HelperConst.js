import React from 'react';
import { Decimal } from 'decimal.js';

export default class HelperConst {

    static moneySymbol = "$";
    // static knowledgeSymbol = "𓂀";
    // static knowledgeSymbol = '\u29a8';
    static knowledgeSymbol = "&";

    static moneySymbolSpan() { return (<span className="moneySymbol">{this.moneySymbol}</span>); };
    static knowledgeSymbolSpan() { return (<span className="knowledgeSymbol">{this.knowledgeSymbol}</span>); };

    static myNumFormat() {
        return ({
            backend: 'decimal.js',
            sigfigs: 4,
            maxSmall: 10,
            format: 'engineering',
            Decimal: Decimal
        });
    };

    static myFormatter() {
        const numberformat = require('swarm-numberformat');
        if (!this.numberformat) {
            this.numberformat = new numberformat.Formatter(HelperConst.myNumFormat());
        }
        return this.numberformat;

    }
}