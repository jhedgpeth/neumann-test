import React from 'react';
import HelperConst from './HelperConst';
import ComputeFunc from './ComputeFunc';
import './styles/fonts.css';
import ScrollBar  from 'react-scrollbars-custom';
const mylog = HelperConst.DebugLog;

export default class Upgrades extends React.Component {

    componentDidMount() {
        mylog("upgrades didmount");
    }

    componentWillUnmount() {
        mylog("upgrades willunmount");
    }

    render() {
        const sources = this.props.upgrades.reduce((result, item) => {
            const u = this.props.userSettings.upgStats[item.id];
            // mylog("u:",u);
            if (!u.purchased && u.revealed) {
                result.push(item);
            }
            return result;
        }, []);
        // mylog("sources:",sources);

        const rows = sources.map(item => {
            const u = this.props.userSettings.upgStats[item.id];
            if (u.purchased || !u.revealed) { return ""; };

            let n = item.name;
            let buyClass = "";
            let buttonDisabled = true;

            let buyPct = 0;
            let bgClass = "";

            if (item.costType === "money") {
                bgClass = "money ";
                buyPct = ComputeFunc.buyPct(item.costValue, this.props.userSettings.money);

                if (this.props.userSettings.money.gte(item.costValue)) {
                    buyClass += "canAfford ";
                    buttonDisabled = false;
                } else {
                    buyClass += "cannotAfford ";
                }
            }
            if (item.costType === "knowledge") {
                bgClass = "knowledge ";
                buyPct = ComputeFunc.buyPct(item.costValue, this.props.userSettings.knowledge);

                if (this.props.userSettings.knowledge.gte(item.costValue)) {
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
                        {this.props.businesses[item.rewardTarget].name} x{item.rewardValue}
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