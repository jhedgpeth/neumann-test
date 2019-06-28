import React from 'react';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';


export default class Business extends React.Component {


    render() {
        this.numberformat = HelperConst.myFormatter();
        let rows = [];
        this.props.businesses.forEach((item) => {
            const n = item.name;
            const myCost = ComputeFunc.getCost(item, this.props.purchaseAmt, this.props.money);
            // console.log(myCost);
            let buttonClass = "";
            let costClass = "";
            let buttonDisabled = false;
            if (this.props.money.gte(myCost.cost)) {
                buttonClass = "business-buy canAfford";
                costClass = "cost-wrapper canAfford";
            } else {
                buttonClass = "business-buy cannotAfford";
                buttonDisabled = true;
                costClass = "cost-wrapper cannotAfford";
            }

            const myEarning = ComputeFunc.computeEarning(item);
            // console.log(this.props.money.toFixed(2));

            rows.push(
                <div key={n + "business"} className="business">
                    <div key={n + "button-wrapper"} className="button-wrapper">
                        <button
                            key={n + "button"}
                            className={buttonClass}
                            onClick={() => this.props.onClick(item)}
                            disabled={buttonDisabled}>
                            {myCost.num}x {n}
                        </button>
                        <div key={n + "owned"} className="business-owned">{this.numberformat.format(item.owned)}</div>
                    </div>

                    <div key={n + "cost-wrapper"} className={costClass}>
                        <div key={n + "cost-money"} className="business-cost-money">{HelperConst.moneySymbolSpan()}{this.numberformat.format(myCost.cost)}</div>
                    </div>

                    <div key={n + "earning-wrapper"} className="earning-wrapper">
                        <div key={n + "revenue-total"} className="business-revenue-total">+ {HelperConst.moneySymbolSpan()}{this.numberformat.format(myEarning)}/s</div>
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

