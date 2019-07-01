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
            prestige: { num: new Decimal(1000), val: 5 },
            prestigeNext: new Decimal(0),
            lifetimeEarnings: new Decimal(0),
        };

        this.timeInterval = 100;
        this.timeMultiplier = this.timeInterval / 1000;

        // this._business = React.createRef();
        this.restart = this.restart.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.prestige = this.prestige.bind(this);
        this.updatePrestigeEarned = this.updatePrestigeEarned.bind(this);
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
        this.prestigeIntervalId = setInterval(this.updatePrestigeEarned, 1000);

        this.cleanState = { ...this.state };
        delete this.cleanState.pauseText;
        delete this.cleanState.purchaseAmt;

    }

    componentWillUnmount() {
        console.log("game willunmount");
        clearInterval(this.gameIntervalId);
    }

    componentDidUpdate() {
        // console.log("game didupdate");

    }

    resetAll() {
        this.pause();
        this.setState((state) => ({
            money: new Decimal(0),
            knowledge: new Decimal(0),
            businesses: BusinessInit(),
            probes: ProbeInit(),
            upgrades: UpgradeInit(),
            purchaseAmt: "1",
            prestige: { num: new Decimal(1000), val: 5 },
            prestigeNext: new Decimal(0),
            lifetimeEarnings: new Decimal(0),
        }));
        this.resume();
    }

    restart() {
        this.pause();
        this.setState(this.cleanState);
        this.setState((state) => ({
            businesses: BusinessInit(),
            probes: ProbeInit(),
            upgrades: UpgradeInit(),
            money: new Decimal(0),
        }));
        this.resume();
    }

    pause() {
        if (this.gameIntervalId) {
            clearInterval(this.gameIntervalId);
            delete (this.gameIntervalId);
        }
    }

    resume() {
        if (!this.gameIntervalId) {
            this.gameIntervalId = setInterval(this.updateGame, this.timeInterval);
        }
    }

    updatePrestigeEarned() {
        const newPrestigeNext = ComputeFunc.calcPrestigeEarned(this.state.lifetimeEarnings);
        if (newPrestigeNext !== this.state.prestigeNext) {
            this.setState({
                prestigeNext: newPrestigeNext,
            })
        }
        // console.log(Decimal.sqrt(this.state.lifetimeEarnings.div(Math.pow(10, 6))).times(150));
    }

    prestige() {
        if (this.state.prestigeNext.gt(0)) {
            this.updatePrestigeEarned();
            const newPrestige = this.state.prestige.num.plus(this.state.prestigeNext);
            this.restart();
            this.setState((state) => ({
                prestige: { num: newPrestige, val: state.prestige.val },
            }));
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
        const revenuePerSec = ComputeFunc.totalEarning(this.state.businesses, this.state.prestige);
        const revenuePerTick = ComputeFunc.getEarningPerTick(revenuePerSec, this.timeInterval);
        const newLifetimeEarnings = this.state.lifetimeEarnings.plus(revenuePerTick);

        const learningPerSec = ComputeFunc.totalEarning(this.state.probes, this.state.prestige);
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
            lifetimeEarnings: newLifetimeEarnings,
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
                        prestige={this.state.prestige}
                        prestigeNext={this.state.prestigeNext}
                    />

                </div>
                <div className="left-sidebar">

                    <Upgrades
                        upgrades={this.state.upgrades}
                        businesses={this.state.businesses}
                        money={this.state.money}
                        knowledge={this.state.knowledge}
                        onClick={this.clickUpgrade}
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
                    <button className="pause-button" onClick={this.pause}>Pause</button>
                    <button className="pause-button" onClick={this.resume}>Resume</button>
                    <button className="reset-button" onClick={this.resetAll}>RESET</button>
                    <button
                        className="prestige-button"
                        disabled={this.state.prestigeNext.gt(0) ? false : true}
                        onClick={this.prestige}>Prestige</button>

                </div>

                <div id="content">
                    <div className="container">

                        <Business
                            businesses={this.state.businesses}
                            purchaseAmt={this.state.purchaseAmt}
                            money={this.state.money}
                            prestige={this.state.prestige}
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


