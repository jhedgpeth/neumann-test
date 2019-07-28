import React from 'react';
import ReactDOM from 'react-dom'
import update from 'immutability-helper';
// import styled from 'styled-components';
import { Motion, spring } from 'react-motion';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import './styles/fonts.css';
const Decimal = require('decimal.js');
// const mylog = HelperConst.DebugLog;


export default class Business extends React.Component {

    static overlayCt = 0;

    static computeNextPayoutValue(bus, userSettings, buyNum) {
        const nextOwned = userSettings.busStats[bus.id].owned + buyNum;
        const num25s = Math.floor(nextOwned / 25);
        // 25, 50, 75, 100, 200, ...
        const mult25 = num25s > 3 ? 3 : num25s;
        const mult100 = Math.floor(nextOwned / 100);
        const prestigeMultiplier = userSettings.prestige.num.times(userSettings.prestige.val).div(100).plus(1);
        let revenue = new Decimal(
            bus.incomeBase
                .times(nextOwned)
                .times(Math.pow(2, mult25))
                .times(Math.pow(4, mult100))
                .times(userSettings.busStats[bus.id].payoutAdj)
                .times(prestigeMultiplier)
        );
        return revenue;
    }
    static computeEarningPerSec(item, userSettings) {
        return this.computeNextPayoutValue(item, userSettings, 0).div(userSettings.busStats[item.id].timeAdj);
    }
    static computeTotalEarningPerSec(items, userSettings) {
        let revenue = new Decimal(0);
        items.forEach((item) => {
            revenue = revenue.plus(this.computeEarningPerSec(item, userSettings));
        });
        return revenue;
    }

    static getPayout(bus, userSettings) {
        return this.computeNextPayoutValue(bus, userSettings, 0).times(bus.payout);
    }

    static getAllPayouts(items, userSettings) {
        let revenue = new Decimal(0);
        items.forEach((item) => {
            revenue = revenue.plus(this.getPayout(item, userSettings));
        });
        return revenue;
    }


    static applyMultiplier(bus, mult) {
        return update(bus, {
            upgradeMult: { $set: bus.upgradeMult * mult },
        })
    }

    static getAdjustedTimeBase(bus, milestoneIdx) {
        if (milestoneIdx >= 0) {
            return bus.timeBase / Math.pow(2, milestoneIdx);
        }
        return bus.timeBase;
    }

    static getPosition(reactRef) {
        return ReactDOM
            .findDOMNode(reactRef.current)
            .getBoundingClientRect();
    }

    getDomRef(name) {
        const idx = this.props.domRefs.findIndex(ref => ref.name === name);
        if (idx < 0) return undefined;
        const ref = this.props.domRefs[idx].domRef;
        return ref;
    }

    genOverlays(bus) {
        let textClass = "overlay-text ";
        return (
            bus.overlays.map((o, idx) => {
                // mylog("showing overlay for:", bus.name);
                let ovClass = textClass;
                const domLeft = parseInt(this.getDomRef(bus.name).current.offsetLeft, 10);
                const domTop = parseInt(this.getDomRef(bus.name).current.offsetTop, 10);
                // mylog("domLeft:", domLeft, " domTop:", domTop);
                let curLeft = domLeft + 80;
                let curTop = domTop - 15;
                if (o.counter > o.expire) {
                    ovClass += "expired ";
                }
                let topChg = 0;
                let leftChg = 0;
                switch (o.ovType) {
                    case "ownedBonus":
                        leftChg = 100;
                        break;
                    default:
                        topChg = -40;
                        break;
                }
                return (
                    <Motion key={"overlay-text " + o.id}
                        defaultStyle={{
                            top: curTop,
                            left: curLeft,
                            opacity: 1,
                        }}
                        style={{
                            top: spring(curTop + topChg + o.yTarget),
                            left: spring(curLeft + leftChg + o.xTarget),
                            opacity: spring(0, { stiffness: 15, damping: 14 }),
                        }}
                    >

                        {style => (
                            <div
                                key={"overlay-text " + o.id}
                                className={ovClass + "rainbow_text_animated "}
                                style={{
                                    top: style.top,
                                    left: style.left,
                                    opacity: style.opacity,
                                }} >{o.text}</div>
                        )}

                    </Motion>


                );

            })
        )
    }


    render() {
        const sources = this.props.businesses.reduce((result, item) => {
            if (this.props.userSettings.busStats[item.id].revealed) {
                result.push(item);
            }
            return result;
        }, []);

        const totalEarningPerSec = Business.computeTotalEarningPerSec(this.props.businesses, this.props.userSettings);


        const rows = sources.map((item) => {
            const b = this.props.userSettings.busStats[item.id];
            const n = item.name;
            const myCost = ComputeFunc.getCost(item, this.props.userSettings.busStats[item.id], this.props.purchaseAmt, this.props.userSettings.money);
            // mylog(myCost);
            const nextPayout = Business.computeNextPayoutValue(item, this.props.userSettings, myCost.num);

            const buyPct = ComputeFunc.buyPct(myCost.cost, this.props.userSettings.money);
            const buyPctStyle = { width: buyPct + '%' };
            const earnPct = ComputeFunc.earnPct(item, b.timeAdj);
            const earnPctStyle = { width: earnPct + '%' };

            let bgClass = "money ";
            let buttonClass = "";
            let costClass = "";
            let buttonDisabled = false;
            if (this.props.userSettings.money.gte(myCost.cost)) {
                buttonClass = "business-buy canAfford ";
                costClass = "cost-wrapper canAfford ";
            } else {
                buttonClass = "business-buy cannotAfford ";
                buttonDisabled = true;
                costClass = "cost-wrapper cannotAfford ";
            }

            const myEarningPerSec = Business.computeEarningPerSec(item, this.props.userSettings);
            let curPayout = Business.computeNextPayoutValue(item, this.props.userSettings, 0);
            const myPayout = curPayout.gt(0) ? curPayout : nextPayout;
            const myEarningPct = ComputeFunc.getEarningPct(myEarningPerSec, totalEarningPerSec);



            const overlayItems = this.genOverlays(item);
            // mylog("overlayItems:",overlayItems);

            return (
                <div key={item.id + "business"} className={"business " + bgClass} ref={this.getDomRef(n)} >
                    <div className="overlays-wrapper">
                        {overlayItems}
                    </div>
                    <div className={"business-buy-progress " + bgClass}>
                        <div className={"business-buy-progress-pct " + bgClass} style={buyPctStyle}>
                            <span ></span>
                        </div>
                    </div>
                    <div className={"business-earn-progress " + bgClass}>
                        <div className={"business-earn-progress-pct " + bgClass} style={earnPctStyle}>
                            <span ></span>
                        </div>
                    </div>
                    <button
                        key={item.id + "button"}
                        className={buttonClass + bgClass}
                        onClick={() => this.props.onClick(item)}
                        disabled={buttonDisabled}>
                        <span
                            className="buyMultiple">{myCost.num}{HelperConst.multiplySymbolSpan()}
                        </span> {n}
                    </button>
                    <div key={item.id + "owned"} className="business-owned">{HelperConst.showInt(b.owned)}</div>

                    <div key={item.id + "cost-wrapper"} className={costClass}>
                        <div key={item.id + "cost-money"} className="business-cost-money">{HelperConst.moneySymbolSpan()}{HelperConst.showNum(myCost.cost)}</div>
                    </div>

                    <div key={item.id + "earning-wrapper"} className="earning-wrapper">
                        <div key={item.id + "revenue-total"} className="business-revenue-total">+{HelperConst.moneySymbolSpan()}{HelperConst.showNum(myPayout)}</div>
                    </div>

                    <div key={item.id + "earning-pct-wrapper"} className="earning-pct-wrapper">
                        <div key={item.id + "earning-pct"} className="earning-pct">{myEarningPct}%</div>
                    </div>
                </div>
            );
        });


        return (
            <div className="business-container">
                {rows}
            </div>
        )
    };
};

