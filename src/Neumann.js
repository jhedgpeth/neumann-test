import React from 'react';
import update from 'immutability-helper';
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
import ScrollContainer from 'react-indiana-drag-scroll'



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
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
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

    pause() {
        if (this.gameIntervalId) {
            clearInterval(this.gameIntervalId);
            delete(this.gameIntervalId);
        }
    }

    resume() {
        if (!this.gameIntervalId) {
            this.gameIntervalId = setInterval(this.updateGame, this.timeInterval);
        }
    }

    updatePurchaseAmt(amt) {
        if (HelperConst.purchaseOpts.indexOf(amt) !== -1 && this.state.purchaseAmt !== amt) {
            this.setState({
                purchaseAmt: amt,
            })
        }
        // console.log(this.state.businesses);
        // console.log(this.state.businesses[0]);
        // console.log(ComputeFunc.maxBuy(this.state.businesses[0], this.state.money).max25);
    }

    updateGame() {
        const revenuePerSec = ComputeFunc.totalEarning(this.state.businesses);
        const revenuePerTick = ComputeFunc.getEarningPerTick(revenuePerSec, this.timeInterval);

        const learningPerSec = ComputeFunc.totalEarning(this.state.probes);
        const learningPerTick = ComputeFunc.getEarningPerTick(learningPerSec, this.timeInterval);

        const newUpgrades = this.state.upgrades.map(item => {
            if (!item.revealed) {
                if (item.watchType === "money" && item.watchValue.lte(this.state.money)) {
                    item.revealed = true;
                    console.log("revealed upgrade", item.name);
                };
                if (item.watchType === "knowledge" && item.watchValue.lte(this.state.knowledge)) {
                    item.revealed = true;
                    console.log("revealed upgrade", item.name);
                };
            }
            return item;
        })

        this.setState({
            money: this.state.money.plus(revenuePerTick),
            knowledge: this.state.knowledge.plus(learningPerTick),
            upgrades: newUpgrades,
        });
    }

    clickBusiness(bus) {
        console.log("business click ", bus.name);
        const busCost = ComputeFunc.getCost(bus, this.state.purchaseAmt, this.state.money);

        const idx = this.state.businesses.findIndex(btest => btest.name === bus.name);
        this.setState({
            businesses: update(this.state.businesses, {
                [idx]: {
                    owned: { $set: bus.owned + busCost.num },
                }
            }),
            money: this.state.money.minus(busCost.cost),
        });

    }

    clickUpgrade(upg) {
        console.log("upgrade click ", upg.name);

        const idx = this.state.upgrades.findIndex(utest => utest.name === upg.name);
        this.setState({
            upgrades: update(this.state.upgrades, {
                [idx]: {
                    purchased: { $set: true },
                }
            }),
        });

        switch (upg.costType) {
            case "money":
                this.setState({
                    money: this.state.money.minus(upg.costValue),
                });
                break;
            case "knowledge":
                this.setState({
                    knowledge: this.state.knowledge.minus(upg.costValue),
                });
                break;
            default:
                break;
        }

        switch (upg.rewardType) {
            case "upgradeMult":
                const busIdx = this.state.businesses.findIndex(utest => utest.name === upg.rewardTarget);
                this.setState({
                    businesses: update(this.state.businesses, {
                        [busIdx]: {
                            $set: Business.applyMultiplier(
                                this.state.businesses[busIdx],
                                upg.rewardValue)
                        },
                    }),
                });
                break;
            default:
                console.log("unknown rewardType");
                break;
        }

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
                    <ScrollContainer className="left-sidebar">

                    <Upgrades
                            upgrades={this.state.upgrades}
                            businesses={this.state.businesses}
                            money={this.state.money}
                            knowledge={this.state.knowledge}
                            onClick={this.clickUpgrade}
                        />

                    </ScrollContainer>
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
                    <button className="pause-button" onClick={this.pause}>Pause</button>
                    <button className="pause-button" onClick={this.resume}>Resume</button>

                </div>

                <div id="content">
                    <div className="container">

                    <Business
                            businesses={this.state.businesses}
                            purchaseAmt={this.state.purchaseAmt}
                            money={this.state.money}
                            onClick={this.clickBusiness}
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


