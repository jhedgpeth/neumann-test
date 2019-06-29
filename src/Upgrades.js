import React from 'react';
// import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';


export default class Upgrades extends React.Component {



    render() {

        const sources = this.props.upgrades.reduce((result, item) => {
            if (!item.purchased && item.revealed) {
                result.push(item);
            }
            return result;
        }, []);

        const rows = sources.map(item => {
            if (item.purchased || !item.revealed) { return ""; };

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
            let costSymbol = ""
            switch (item.costType) {
                case "knowledge":
                    costSymbol = HelperConst.knowledgeSymbolSpan();
                    break;
                default:
                    costSymbol = HelperConst.moneySymbolSpan();
                    break;
            }

            return (
                <div key={n + "upgrade"} className="upgrade" >
                    <button
                        key={n + "button"}
                        className={buttonClass}
                        onClick={() => this.props.onClick(item)}
                        disabled={buttonDisabled}>
                        {n}
                    </button>
                    <div key={n + "upgrade-reward"} className="upgrade-reward">
                        {item.rewardTarget} x{item.rewardValue}
                    </div>
                    <div key={n + "upgrade-cost-wrapper"} className="upgrade-cost-wrapper canAfford">
                        {costSymbol}{HelperConst.showNum(item.costValue)}
                    </div>
                </div >
            )

        });

        return (
            <div className="upgrade-container">
                {rows}
            </div>
        )

    }

}