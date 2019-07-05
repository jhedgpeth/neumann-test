import React from 'react';
import HelperConst from './HelperConst';
import ComputeFunc from './ComputeFunc';
import './styles/fonts.css';
import ScrollBar  from 'react-scrollbars-custom';

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
            let buyClass = "";
            let buttonDisabled = true;

            let buyPct = 0;
            let bgClass = "";

            if (item.costType === "money") {
                bgClass = "money ";
                buyPct = ComputeFunc.buyPct(item.costValue, this.props.money);

                if (this.props.money.gte(item.costValue)) {
                    buyClass += "canAfford ";
                    buttonDisabled = false;
                } else {
                    buyClass += "cannotAfford ";
                }
            }
            if (item.costType === "knowledge") {
                bgClass = "knowledge ";
                buyPct = ComputeFunc.buyPct(item.costValue, this.props.knowledge);

                if (this.props.knowledge.gte(item.costValue)) {
                    buyClass += "canAfford ";
                    buttonDisabled = false;
                } else {
                    buyClass += "cannotAfford ";
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

            let bgAnim = buyPct<100 ? "upgAnim " : "";
            const buyPctStyle = { width: buyPct + '%' }

            return (
                <div key={n + "upgrade"} className={"upgrade "+bgClass} >
                    <div className={"upgrade-buy-progress " + bgClass}>
                        <div className={"upgrade-buy-progress-pct " + bgClass + bgAnim} style={buyPctStyle}>
                            <span ></span>
                        </div>
                    </div>
                    <button
                        key={n + "button"}
                        className={"upgrade-buy " + buyClass + bgClass}
                        onClick={() => this.props.onClick(item)}
                        disabled={buttonDisabled}>
                        {n}
                    </button>
                    <div key={n + "upgrade-reward"} className="upgrade-reward">
                        {item.rewardTarget} x{item.rewardValue}
                    </div>
                    <div key={n + "upgrade-cost-wrapper"} className={"upgrade-cost-wrapper " + buyClass +bgClass} >
                        {costSymbol}{HelperConst.showNum(item.costValue)}
                    </div>
                </div >
            )

        });

        return (
                <ScrollBar permanentTrackY={true} className="upgrade-container">
                    {rows}
                </ScrollBar>
        )

    }

}