import React from 'react';
import update from 'immutability-helper';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';


export default class Business extends React.Component {

    static applyMultiplier(bus, mult) {
        return update(bus, {
            upgradeMult: { $set: bus.upgradeMult * mult },
        })
    }

    render() {

        const totalEarning = ComputeFunc.totalEarning(this.props.businesses);

        const rows = this.props.businesses.map((item) => {
            const n = item.name;
            const myCost = ComputeFunc.getCost(item, this.props.purchaseAmt, this.props.money);
            // console.log(myCost);

            const buyPct = ComputeFunc.buyPct(myCost.cost, this.props.money);
            const buyPctStyle = { width: buyPct + '%' }

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

            const myEarning = ComputeFunc.computeEarning(item);
            // console.log(this.props.money.toFixed(2));
            const myEarningPct = ComputeFunc.getEarningPct(myEarning,totalEarning);


            return (
                <div key={n + "business"} className="business">
                    {/* <div key={n + "button-wrapper"} className="button-wrapper"> */}
                        <div className={"business-buy-progress " + bgClass}>
                            <div className={"business-buy-progress-pct "+bgClass} style={buyPctStyle}>
                                <span ></span>
                            </div>
                        </div>
                        <button
                            key={n + "button"}
                            className={buttonClass + bgClass}
                            onClick={() => this.props.onClick(item)}
                            disabled={buttonDisabled}>
                            {myCost.num}x {n}
                        </button>
                        <div key={n + "owned"} className="business-owned">{HelperConst.showInt(item.owned)}</div>
                    {/* </div> */}

                    <div key={n + "cost-wrapper"} className={costClass}>
                        <div key={n + "cost-money"} className="business-cost-money">{HelperConst.moneySymbolSpan()}{HelperConst.showNum(myCost.cost)}</div>
                    </div>

                    <div key={n + "earning-wrapper"} className="earning-wrapper">
                        <div key={n + "revenue-total"} className="business-revenue-total">+{HelperConst.moneySymbolSpan()}{HelperConst.showNum(myEarning)}/s</div>
                    </div>

                    <div key={n+"earning-pct-wrapper"} className="earning-pct-wrapper">
                        <div key={n+"earning-pct"} className="earning-pct">{myEarningPct}%</div>
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

