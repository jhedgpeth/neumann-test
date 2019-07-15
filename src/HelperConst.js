import React from 'react';
// import { Decimal } from 'decimal.js';
import './styles/fonts.css';
const Decimal = require('decimal.js');
const numberformat = require('swarm-numberformat');

export default class HelperConst {

    static moneySymbol = "$";
    // static knowledgeSymbol = "𓂀";
    static knowledgeSymbol = '\u29a8';
    // static knowledgeSymbol = "&";
    static prestigeSymbol = '\u039b';

    // static rightarrow = '\u2b95';

    // static multiplySymbol = '\u2718';
    static multiplySymbol = '\u2a2f';

    static thumbsUpSymbol = '👍';

    static moneySymbolSpan() { return (<span className="moneySymbol">{this.moneySymbol}</span>); };
    static knowledgeSymbolSpan() { return (<span className="knowledgeSymbol">{this.knowledgeSymbol}</span>); };
    static prestigeSymbolSpan() { return (<span className="prestigeSymbol">{this.prestigeSymbol}</span>); };
    static multiplySymbolSpan() { return (<span className="multiplySymbol">{this.multiplySymbol}</span>); }

    static purchaseOpts = ["1", "10", "25", "100", "Max", "Max OCD", "Max Upg", "PrimeTime"];
    static purchaseOptsNum = this.purchaseOpts.filter(item => item.match(/\d/));
    static purchaseOptsSpecial = this.purchaseOpts.filter(item => !item.match(/\d/));

    // set all-business milestones for time boost, including all 100's
    static timeMilestones = [10, 25, 50];

    // in kilometers
    static spaceZoomLevels = [
        new Decimal("2.8746e11"), // solar system
        new Decimal("9.5e17"),  //  milky way (diameter)
        new Decimal("14.09555e+17"),  // Segue 1
        new Decimal("14.66319e+17"), // Sagittarius Dwarf
        new Decimal("1.827152e+18"),  // Ursa Major II
        new Decimal("2.078523e+18"),  // Segue 2
        new Decimal("2.135288e+18"),  // Willman 1
        new Decimal("2.94891e+18"),  // Small Magellanic Cloud
        new Decimal("3.122041e+18"),  // Carina Dwarf
        new Decimal("1.3623452e+19"),  // Phoenix Dwarf
        new Decimal("2.0151356e+19"),  // Andromeda II
        new Decimal("2.8382191e+19"),  // Pegasus Dwarf Irregular
        new Decimal("4.0775748e+19"),  // Sextans A
        new Decimal("5.7426634e+19"),  // KKR 25
        new Decimal("440e24"),  // observable universe
        new Decimal("Infinity"),
    ];

    static getSpaceZoomLevelIdx(d) {
        for (let n=0; n<this.spaceZoomLevels.length; n++) {
            if (this.spaceZoomLevels[n].gt(d))  return n;
        }
    }

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
        if (!this.myNumFormat) {
            console.log("entered defining area");
            this.myNumFormat = new numberformat.Formatter(HelperConst.myNumCfg());
        }
        return this.myNumFormat;

    }
    static myFormatterInt() {
        if (!this.myIntFormat) {
            this.myIntFormat = new numberformat.Formatter(HelperConst.myIntCfg());
        }
        return this.myIntFormat;

    }
}