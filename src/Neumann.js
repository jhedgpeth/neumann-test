import React from 'react';
import './index.css';
import { Decimal } from 'decimal.js';
import Income from './Income';
import Business from './Business.js';
// import Probe from './Probe.js';
import BusinessInit from './BusinessInit';
import ProbeInit from './ProbeInit';
import UpgradeInit from './UpgradeInit';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import Upgrades from './Upgrades';
// import HelperConst from './HelperConst';


// =====================================================
export default class Neumann extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            money: new Decimal(0),
            knowledge: new Decimal(0),
            businesses: [],
            probes: [],
            upgrades: [],
            purchaseAmt: "1",
        };

        this.timeInterval = 100;
        this.timeMultiplier = this.timeInterval / 1000;

        // this._business = React.createRef();
        this.updateGame = this.updateGame.bind(this);
        this.clickBusiness = this.clickBusiness.bind(this);
        this.clickUpgrade = this.clickUpgrade.bind(this);

    }

    componentDidMount() {
        console.log("game didmount");
        this.setState({
            businesses: BusinessInit(),
            probes: ProbeInit(),
            upgrades: UpgradeInit(),
            money: new Decimal(0),
        })
        this.gameIntervalId = setInterval(this.updateGame, this.timeInterval);

    }

    componentWillUnmount() {
        console.log("game willunmount");
        clearInterval(this.gameIntervalId);
    }

    componentDidUpdate() {
        // console.log("game didupdate");

    }

    updatePurchaseAmt(amt) {
        if (HelperConst.purchaseOpts.indexOf(amt) !== -1 && this.state.purchaseAmt !== amt) {
            this.setState({
                purchaseAmt: amt,
            })
        }
        console.log(this.state.businesses);
        console.log(this.state.businesses[0]);
        console.log(ComputeFunc.maxBuy(this.state.businesses[0], this.state.money).max25);
    }

    updateGame() {
        // console.log("updateGame()");
        // const Decimal = require('decimal.js');

        const revenuePerSec = ComputeFunc.totalEarning(this.state.businesses);
        const revenuePerTick = ComputeFunc.getEarningPerTick(revenuePerSec, this.timeInterval);
        
        const learningPerSec = ComputeFunc.totalEarning(this.state.probes);
        const learningPerTick = ComputeFunc.getEarningPerTick(learningPerSec, this.timeInterval);

        this.setState({
            money: this.state.money.plus(revenuePerTick),
            knowledge: this.state.knowledge.plus(learningPerTick),
        });
    }

    clickBusiness(bus) {
        console.log("business click ", bus.name);
        const busCost = ComputeFunc.getCost(bus, this.state.purchaseAmt, this.state.money);
        if (this.state.money.gte(busCost.cost)) {

            let updatedBus = { ...bus };
            updatedBus.owned = (updatedBus.owned + busCost.num);
            const newMoney = this.state.money.minus(busCost.cost);

            let busList = this.state.businesses.map((b) => {
                return (b.name === bus.name) ? updatedBus : b;
            })
            this.setState((state, props) => ({
                businesses: busList,
                money: newMoney,
            }))
        }
    }

    clickUpgrade(upg) {
        console.log("upgrade click ",upg.name);

        let updatedUpgrade = {...upg};
        updatedUpgrade.purchased = true;
        const newMoney = this.state.money.minus(upg.costValue);
        let UpgList = this.state.upgrades.map((u) => {
            return (u.name === upg.name) ? updatedUpgrade : u;
        });
        this.setState((state, props) => ({
            upgrades: UpgList,
            money: newMoney,
        }))

    }

    render() {

        return (
            <div id="wrapper">
                <div id="header">

                    <Income
                        money={this.state.money}
                        knowledge={this.state.knowledge}
                        businesses={this.state.businesses}
                        probes={this.state.probes}
                    />

                </div>
                <div id="left-sidebar">

                    <Business
                        businesses={this.state.businesses}
                        purchaseAmt={this.state.purchaseAmt}
                        money={this.state.money}
                        onClick={this.clickBusiness}
                    />

                </div>
                <div id="right-sidebar">

                    <div className="purchaseAmts">
                        {HelperConst.purchaseOpts.map((amt) => {
                            let amtClass = "purchase-amount"
                            if (amt === this.state.purchaseAmt) {
                                amtClass = "purchase-amount amt-selected";
                            }
                            return (
                                <button
                                    key={amt + "purchaseAmt"}
                                    className={amtClass}
                                    onClick={() => { this.updatePurchaseAmt(amt) }}>
                                    {amt}
                                </button>
                            )
                        })}
                    </div>

                </div>

                <div id="content">
                    <div className="container">

                        <Upgrades
                            upgrades={this.state.upgrades}
                            businesses={this.state.businesses}
                            money={this.state.money}
                            knowledge={this.state.knowledge}
                            onClick={this.clickUpgrade}
                        />

                    </div>

                </div>

                <div id="footer">

                    footer

                </div>
            </div>
        )
    }




}

// =====================================================


