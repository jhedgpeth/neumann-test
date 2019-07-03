import React from 'react';
import HelperConst from './HelperConst';
import ComputeFunc from './ComputeFunc';
import './fonts.css';

export default class Upgrades extends React.Component {

    componentDidMount() {
        console.log("upgrades didmount");
    }

    componentWillUnmount() {
        console.log("upgrades willunmount");
    }

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
            let buttonClass = "upgrade-buy ";
            let buttonDisabled = true;

            let buyPct = 0;
            let bgClass = "";

            if (item.costType === "money") {
                bgClass = "money ";
                buyPct = ComputeFunc.buyPct(item.costValue, this.props.money);

                if (this.props.money.gte(item.costValue)) {
                    buttonClass += "canAfford ";
                    buttonDisabled = false;
                } else {
                    buttonClass += "cannotAfford ";
                }
            }
            if (item.costType === "knowledge") {
                bgClass = "knowledge ";
                buyPct = ComputeFunc.buyPct(item.costValue, this.props.knowledge);

                if (this.props.knowledge.gte(item.costValue)) {
                    buttonClass += "canAfford ";
                    buttonDisabled = false;
                } else {
                    buttonClass += "cannotAfford ";
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

            const buyPctStyle = { width: buyPct + '%' }

            return (
                <div key={n + "upgrade"} className={"upgrade "+bgClass} >
                    <div className={"upgrade-buy-progress " + bgClass}>
                        <div className={"upgrade-buy-progress-pct " + bgClass} style={buyPctStyle}>
                            <span ></span>
                        </div>
                    </div>
                    <button
                        key={n + "button"}
                        className={buttonClass + bgClass}
                        onClick={() => this.props.onClick(item)}
                        disabled={buttonDisabled}>
                        {n}
                    </button>
                    <div key={n + "upgrade-reward"} className="upgrade-reward">
                        {item.rewardTarget} x{item.rewardValue}
                    </div>
                    <div key={n + "upgrade-cost-wrapper"} className={"upgrade-cost-wrapper canAfford "+bgClass} >
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