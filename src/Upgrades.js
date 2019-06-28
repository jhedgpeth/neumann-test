import React from 'react';
// import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';


export default class Upgrades extends React.Component {



    render() {
        let rows = [];

        this.props.upgrades.forEach((item) => {
            if (item.purchased) { return; };
            if (item.watchType === "money" && item.watchValue.gt(this.props.money)) { return; };
            if (item.watchType === "knowledge" && item.watchValue.gt(this.props.knowledge)) { return; };


            let n = item.name;
            let buttonClass = "upgrade-buy";
            let buttonDisabled = true;
            if (item.costType === "money") {
                if (this.props.money.gte(item.costValue)) {
                    buttonClass += " canAfford";
                    buttonDisabled = false;
                } else {
                    buttonClass += " cannotAfford";
                }
            }
            if (item.costType === "knowledge") {
                if (this.props.knowledge.gte(item.costValue)) {
                    buttonClass += " canAfford";
                    buttonDisabled = false;
                } else {
                    buttonClass += " cannotAfford";
                }
            }

            rows.push(
                <div key={n + "upgrade"} className="upgrade">
                    <button
                        key={n + "button"}
                        className={buttonClass}
                        onClick={() => this.props.onClick(item)}
                        disabled={buttonDisabled}>
                        {n}
                    </button>
                    <div key={n + "upgrade-cost-wrapper"} className="upgrade-cost-wrapper canAfford">
                        {HelperConst.moneySymbolSpan()}{HelperConst.showNum(item.costValue)}
                    </div>
                </div>
            )

        });

        return (
            <div className="upgrade-container">
                {rows}
            </div>
        )

    }

}