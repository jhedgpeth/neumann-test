import React from 'react';
import ReactDOM from 'react-dom'
import update from 'immutability-helper';
// import styled from 'styled-components';
import { Motion, spring } from 'react-motion';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import './styles/fonts.css';


export default class Business extends React.Component {

    static overlayCt = 0;

    static applyMultiplier(bus, mult) {
        return update(bus, {
            upgradeMult: { $set: bus.upgradeMult * mult },
        })
    }

    static getAdjustedTimeBase(bus, milestone) {
        const mults = ComputeFunc.timeMilestoneIdx(milestone);
        // console.log("mults:",mults);
        if (mults >= 0) {
            return bus.timeBase / Math.pow(2, mults);
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
                // console.log("showing overlay for:", bus.name);
                let ovClass = textClass;
                const domLeft = parseInt(this.getDomRef(bus.name).current.offsetLeft, 10);
                const domTop = parseInt(this.getDomRef(bus.name).current.offsetTop, 10);
                // console.log("domLeft:", domLeft, " domTop:", domTop);
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
            if (item.revealed) {
                result.push(item);
            }
            return result;
        }, []);

        const totalEarningPerSec = ComputeFunc.computeTotalEarningPerSec(this.props.businesses, this.props.prestige);


        const rows = sources.map((item) => {
            const n = item.name;
            const myCost = ComputeFunc.getCost(item, this.props.purchaseAmt, this.props.money);
            // console.log(myCost);
            const nextPayout = ComputeFunc.computeNextPayoutValueMoney(item, this.props.prestige, myCost.num);

            const buyPct = ComputeFunc.buyPct(myCost.cost, this.props.money);
            const buyPctStyle = { width: buyPct + '%' };
            const earnPct = ComputeFunc.earnPct(item);
            const earnPctStyle = { width: earnPct + '%' };

            let bgClass = "money ";
            let buttonClass = "";
            let costClass = "";
            let buttonDisabled = false;
            if (this.props.money.gte(myCost.cost)) {
                buttonClass = "business-buy canAfford ";
                costClass = "cost-wrapper canAfford ";
            } else {
                buttonClass = "business-buy cannotAfford ";
                buttonDisabled = true;
                costClass = "cost-wrapper cannotAfford ";
            }

            const myEarningPerSec = ComputeFunc.computeEarningPerSec(item, this.props.prestige);
            let curPayout = ComputeFunc.computePayoutValueMoney(item, this.props.prestige);
            const myPayout = curPayout.gt(0) ? curPayout : nextPayout;
            const myEarningPct = ComputeFunc.getEarningPct(myEarningPerSec, totalEarningPerSec);



            const overlayItems = this.genOverlays(item);
            // console.log("overlayItems:",overlayItems);

            return (
                <div key={n + "business"} className={"business " + bgClass} ref={this.getDomRef(n)} >
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
                        key={n + "button"}
                        className={buttonClass + bgClass}
                        onClick={() => this.props.onClick(item)}
                        disabled={buttonDisabled}>
                        <span
                            className="buyMultiple">{myCost.num}{HelperConst.multiplySymbolSpan()}
                        </span> {n}
                    </button>
                    <div key={n + "owned"} className="business-owned">{HelperConst.showInt(item.owned)}</div>

                    <div key={n + "cost-wrapper"} className={costClass}>
                        <div key={n + "cost-money"} className="business-cost-money">{HelperConst.moneySymbolSpan()}{HelperConst.showNum(myCost.cost)}</div>
                    </div>

                    <div key={n + "earning-wrapper"} className="earning-wrapper">
                        <div key={n + "revenue-total"} className="business-revenue-total">+{HelperConst.moneySymbolSpan()}{HelperConst.showNum(myPayout)}</div>
                    </div>

                    <div key={n + "earning-pct-wrapper"} className="earning-pct-wrapper">
                        <div key={n + "earning-pct"} className="earning-pct">{myEarningPct}%</div>
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

