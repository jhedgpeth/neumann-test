import React from 'react';
// import { Decimal } from 'decimal.js';
import './fonts.css';
let Decimal = require('decimal.js');

export default class HelperConst {

    static moneySymbol = "$";
    // static knowledgeSymbol = "𓂀";
    static knowledgeSymbol = '\u29a8';
    // static knowledgeSymbol = "&";
    static prestigeSymbol = '\u039b';

    // static rightarrow = '\u2b95';

    // static multiplySymbol = '\u2718';
    static multiplySymbol = '\u2a2f';


    static moneySymbolSpan() { return (<span className="moneySymbol">{this.moneySymbol}</span>); };
    static knowledgeSymbolSpan() { return (<span className="knowledgeSymbol">{this.knowledgeSymbol}</span>); };
    static prestigeSymbolSpan() { return (<span className="prestigeSymbol">{this.prestigeSymbol}</span>); };
    static multiplySymbolSpan() { return (<span className="multiplySymbol">{this.multiplySymbol}</span>);}

    static purchaseOpts = ["1", "10", "25", "Max", "Max OCD", "Max Upg", "PrimeTime"];
    static purchaseOptsNum = this.purchaseOpts.filter(item => item.match(/\d/));
    static purchaseOptsSpecial = this.purchaseOpts.filter(item => !item.match(/\d/));
    

    static showNum(num) {
        return HelperConst.myFormatterNum().format(num);
    }

    static showInt(num) {
        return HelperConst.myFormatterInt().format(num);
    }

    static myNumCfg() {
        return ({
            backend: 'decimal.js',
            sigfigs: 4,
            maxSmall: 100,
            format: 'engineering',
            Decimal: Decimal
        });
    };

    static myIntCfg() {
        return ({
            backend: 'decimal.js',
            sigfigs: 4,
            maxSmall: 0,
            format: 'engineering',
            Decimal: Decimal
        });
    };

    static myFormatterNum() {
        const numberformat = require('swarm-numberformat');
        if (!this.myNumFormat) {
            console.log("entered defining area");
            this.myNumFormat = new numberformat.Formatter(HelperConst.myNumCfg());
        }
        return this.myNumFormat;

    }
    static myFormatterInt() {
        const numberformat = require('swarm-numberformat');
        if (!this.myIntFormat) {
            this.myIntFormat = new numberformat.Formatter(HelperConst.myIntCfg());
        }
        return this.myIntFormat;

    }
}