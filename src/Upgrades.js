import React from 'react';
import HelperConst from './HelperConst';
import ComputeFunc from './ComputeFunc';
import './styles/fonts.css';
import ScrollBar from 'react-scrollbars-custom';
// import Decimal from 'decimal.js';
const mylog = HelperConst.DebugLog;

export default class Upgrades extends React.Component {

    componentDidMount() {
        mylog("upgrades didmount");
    }

    componentWillUnmount() {
        mylog("upgrades willunmount");
    }

    static autoUpgradeCost(base, coef, idx) {
        mylog("autoupgradecost: base:", HelperConst.showNum(base), "coef:", coef, "idx:", idx);
        const myCoef = coef * 1.5;
        const cost = base.times(
            (Math.pow(myCoef, idx + 10) - 1) / (myCoef - 1)
        );
        mylog("autoupgradecost: $", HelperConst.showNum(cost));
        return cost;
    }

    static autoUpgradeId(busNum, idx) {
        return HelperConst.autoUpgradeBase + (busNum * 1000) + idx;
    }

    static newAutoUpgrades(businesses, upgrades, userSettings) {
        mylog("starting newAutoUpgrades generation");
        Object.keys(userSettings.busStats).forEach(item => {
            const bus = businesses[item];
            let ct = 1;
            mylog("checking upgrade #",ct,"for",item);
            let cost = this.autoUpgradeCost(bus.costBase, bus.costCoef, ct);

            while (userSettings.money.times(1.7).gt(cost)) {
                // TODO: test if already created in upgrades
                
                mylog("creating upgrade #", ct, "for", item);

                cost = this.autoUpgradeCost(bus.costBase, bus.costCoef, ++ct);
            }
        })
    }

    render() {
        const sources = this.props.upgrades.reduce((result, item) => {
            let u = this.props.userSettings.upgStats[item.id];
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
            let costSymbol = "";

            let rewardInfo;
            let clickAction = this.props.onClick;

            if (item.rewardType === "enableFeature") {
                bgClass = "feature ";
            } else if (item.costType === "knowledge") {
                bgClass = "knowledge ";
            } else {
                bgClass = "money ";
            }

            if (item.costType === "money") {
                costSymbol = HelperConst.moneySymbolSpan();
                buyPct = ComputeFunc.buyPct(item.costValue, this.props.userSettings.money);

                if (this.props.userSettings.money.gte(item.costValue)) {
                    buyClass += "canAfford ";
                    buttonDisabled = false;
                } else {
                    buyClass += "cannotAfford ";
                }
            } else {
                costSymbol = HelperConst.knowledgeSymbolSpan();
                buyPct = ComputeFunc.buyPct(item.costValue, this.props.userSettings.knowledge);

                if (this.props.userSettings.knowledge.gte(item.costValue)) {
                    buyClass += "canAfford ";
                    buttonDisabled = false;
                } else {
                    buyClass += "cannotAfford ";
                }
            }



            switch (item.rewardType) {
                case "enableFeature":
                    rewardInfo = item.rewardTarget;
                    clickAction = this.props.enableFeature;
                    break;
                default:
                    rewardInfo = this.props.businesses[item.rewardTarget].name + " x" + item.rewardValue;
                    break;
            }

            let bgAnim = buyPct < 100 ? "upgAnim " : "";
            const buyPctStyle = { width: buyPct + '%' }

            return (
                <div key={item.id + "upgrade"} className={"upgrade " + bgClass} >
                    <div className={"upgrade-buy-progress " + bgClass}>
                        <div className={"upgrade-buy-progress-pct " + bgClass + bgAnim} style={buyPctStyle}>
                            <span ></span>
                        </div>
                    </div>
                    <button
                        key={item.id + "button"}
                        className={"upgrade-buy " + buyClass + bgClass}
                        onClick={() => clickAction(item)}
                        disabled={buttonDisabled}>
                        {n}
                    </button>
                    <div key={item.id + "upgrade-reward"} className="upgrade-reward">
                        {rewardInfo}
                    </div>
                    <div key={item.id + "upgrade-cost-wrapper"} className={"upgrade-cost-wrapper " + buyClass + bgClass} >
                        {costSymbol}{HelperConst.showNum(item.costValue)}
                    </div>
                </div >
            )

        });

        return (
            <ScrollBar permanentTrackY={true} className="upgrade-container" >
                {rows}
            </ScrollBar>
        )

    }

}