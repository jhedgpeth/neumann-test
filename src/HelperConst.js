import React from 'react';
// import { Decimal } from 'decimal.js';
import './styles/fonts.css';
const Decimal = require('decimal.js');
const numberformat = require('swarm-numberformat');

// const DEBUG = true;


export default class HelperConst {
    static DEBUG = true;

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
    static multiplySymbolSpan() { return (<span className="multiplySymbol">{this.multiplySymbol}</span>); };

    /* https://proto.io/freebies/onoff/ */
    static onoffswitch(myId, checked, onClick) {
        if (myId)
            return (
                <div className="onoffswitch">
                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                        id={"toggle"+myId}
                        onChange={onClick}
                        checked={checked}
                    />
                    <label className="onoffswitch-label" htmlFor={"toggle"+myId}>
                        <span className="onoffswitch-inner"></span>
                        <span className="onoffswitch-switch"></span>
                    </label>
                </div>
            )
    }

    static purchaseOpts = ["1", "10", "25", "100", "Max", "Max OCD", "Max Upg", "PrimeTime"];
    static purchaseOptsNum = this.purchaseOpts.filter(item => item.match(/\d/));
    static purchaseOptsSpecial = this.purchaseOpts.filter(item => !item.match(/\d/));

    // set all-business milestones for time boost, including all 100's
    static busBuyMilestones = [10, 25, 50];

    // // in kilometers
    // static spaceZoomLevels = [
    //     new Decimal("384400"),  // moon
    //     new Decimal("2.8746e11"), // solar system
    //     new Decimal("9.5e17"),  //  milky way (diameter)
    //     new Decimal("1.11e20"),  // NGC 4945
    //     new Decimal("440e24"),  // observable universe
    //     // new Decimal("Infinity"),
    // ];
    // static spaceZoomLevelNames = [
    //     "Moon",
    //     "Solar System",
    //     "Milky Way",
    //     "Galaxy NGC 4945",
    //     "Edge of Observable Universe",
    // ];

    static DebugLog() {
        if (HelperConst.DEBUG) {
            console.log.apply(console, arguments);
        }
    }

    static showNum(num) {
        // this.DebugLog("num:",num);
        return HelperConst.myFormatterNum().format(num).toLowerCase();
    }

    static showInt(num) {
        return HelperConst.myFormatterInt().format(num).toLowerCase();
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

    static vonNeumannWiki = <a href="https://google.com">google</a>;
    static modalHelp() {
        return `
This is the help text.
You click businesses, earn money, and see where that can take you...

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
` ;
    }
}