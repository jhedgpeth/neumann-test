import React from 'react';
import update from 'immutability-helper';
import Dropdown from 'react-dropdown'
import './styles/fonts.css';
import './styles/index.scss';
import './styles/dropdown.scss'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Income from './Income';
import Business from './Business.js';
// import Probe from './Probe.js';
// import NeumannInit from './objInit/NeumannInit';
import BusinessInit from './objInit/BusinessInit';
import ProbeInit from './objInit/ProbeInit';
import UpgradeInit from './objInit/UpgradeInit';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import Upgrades from './Upgrades';
import Announce from './Announce';
const Decimal = require('decimal.js');

// =====================================================
export default class Neumann extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            money: new Decimal(1),
            knowledge: new Decimal(0),
            businesses: [],
            probes: [],
            upgrades: [],
            purchaseAmt: "1",
            prestige: { num: new Decimal(0), val: 5 },
            prestigeNext: new Decimal(0),
            lifetimeEarnings: new Decimal(0),
            lifetimeLearning: new Decimal(0),
            timeMilestone: 0,
            tabIndex: 0,
            bonuses: [],
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
        this.purchaseAmtDropDownHandler = this.purchaseAmtDropDownHandler.bind(this);
        this.announce = this.announce.bind(this);

        /* cheats */
        this.prestigeCheat = this.prestigeCheat.bind(this);
        this.cheatPrestigeVal = "1e9";

    }

    componentDidMount() {
        console.log("game didmount");
        this.resetAll();

        this.cleanState = { ...this.state };
        delete this.cleanState.purchaseAmt;
        console.log(HelperConst.purchaseOptsSpecial);
        // this.bonusitvl = setInterval(this.createBonus,1000 );
    }

    componentWillUnmount() {
        console.log("game willunmount");
        clearInterval(this.gameIntervalId);
        clearInterval(this.prestigeIntervalId);
    }

    componentDidUpdate() {
        // console.log("game didupdate");

    }

    resetAll() {
        this.pause();
        this.setState((state) => ({
            money: new Decimal(1),
            knowledge: new Decimal(0),
            businesses: BusinessInit(),
            probes: ProbeInit(),
            upgrades: UpgradeInit(),
            purchaseAmt: "1",
            prestige: { num: new Decimal(0), val: 5 },
            prestigeNext: new Decimal(0),
            lifetimeEarnings: new Decimal(0),
            lifetimeLearning: new Decimal(0),
            timeMilestone: 0,
            tabIndex: 0,
            bonuses: [],
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
            timeMilestone: 0,
            bonuses: [],
        }));
        this.resume();
    }

    pause() {
        if (this.gameIntervalId) {
            clearInterval(this.gameIntervalId);
            delete (this.gameIntervalId);
        }
        if (this.prestigeIntervalId) {
            clearInterval(this.prestigeIntervalId);
            delete (this.prestigeIntervalId)
        }
    }

    resume() {
        if (!this.gameIntervalId) {
            this.gameIntervalId = setInterval(this.updateGame, this.timeInterval);
        }
        if (!this.prestigeIntervalId) {
            this.prestigeIntervalId = setInterval(this.updatePrestigeEarned, 1000);
        }
    }

    updatePrestigeEarned() {
        const newPrestigeNext = ComputeFunc.calcPrestigeEarned(this.state.lifetimeEarnings);
        if (newPrestigeNext !== this.state.prestigeNext) {
            this.setState({
                prestigeNext: newPrestigeNext,
            })
        }
        // console.log("lifetime:",this.state.lifetimeEarnings.toFixed(),"  newprestige:",newPrestigeNext.toFixed());
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

    purchaseAmtDropDownHandler(amt) {
        this.updatePurchaseAmt(amt.value);
    }

    updatePurchaseAmt(amt) {
        console.log("received new purchaseAmt:", amt);
        if (HelperConst.purchaseOpts.indexOf(amt) !== -1 && this.state.purchaseAmt !== amt) {
            this.setState({
                purchaseAmt: amt,
            })
            console.log("new purchaseAmt:", amt);
        }
        // console.log(this.state.businesses);
        // console.log(this.state.businesses[0]);
        // console.log(ComputeFunc.maxBuy(this.state.businesses[0], this.state.money).max25);
    }

    prestigeCheat() {
        console.log("CHEAT: adding", this.cheatPrestigeVal, "prestige");
        this.setState((state) => ({
            prestige: { num: state.prestige.num.plus(this.cheatPrestigeVal), val: state.prestige.val },
        }));
    }


    incrementTimeCounters() {
        let changed = false;
        const newBusinesses = this.state.businesses.map(item => {
            let newItem = { ...item };
            if (item.owned === 0) {
                if (item.revealed && item.timeCounter !== 0) {
                    newItem.timeCounter = 0;
                    changed = true;
                    console.log("resetting ", item.name, " to timeCounter ", newItem.timeCounter);
                }
            } else {
                newItem.payout = false;
                newItem.timeCounter = newItem.timeCounter + this.timeMultiplier;
                if (newItem.timeCounter >= newItem.timeAdjusted) {
                    newItem.payout = true;
                    newItem.timeCounter = 0;
                }
                changed = true;
                // console.log(newItem.name, " timeCounter:", newItem.timeCounter, " payout:",newItem.payout);
            }
            return newItem;
        });
        if (changed) {
            this.setState((state) => ({
                businesses: newBusinesses,
            }))
        }
    }

    updateGame() {
        this.incrementTimeCounters();

        const payoutMoneyThisTick = ComputeFunc.totalPayout(this.state.businesses, this.state.prestige);
        const newLifetimeEarnings = this.state.lifetimeEarnings.plus(payoutMoneyThisTick);
        // console.log("payoutMoneyThisTick:",payoutMoneyThisTick.toFixed());

        const payoutKnowledgeThisTick = ComputeFunc.totalPayout(this.state.probes, this.state.prestige);

        /* reveal businesses if money reached */
        const newBusinesses = this.state.businesses.map(item => {
            let newItem = { ...item };
            if (!item.revealed) {
                if (item.costType === "money" && item.initialVisible.lte(this.state.money)) {
                    newItem.revealed = true;
                    console.log("revealed business", item.name);
                };
                if (item.costType === "knowledge" && item.initialVisible.lte(this.state.knowledge)) {
                    newItem.revealed = true;
                    console.log("revealed business", item.name);
                };
            }
            return newItem;
        })
        /* reveal upgrades if resource reached */
        const newUpgrades = this.state.upgrades.map(item => {
            let newItem = { ...item };
            if (!item.revealed) {
                if (item.watchType === "money" && item.watchValue.lte(this.state.money)) {
                    newItem.revealed = true;
                    console.log("revealed upgrade", item.name);
                };
                if (item.watchType === "knowledge" && item.watchValue.lte(this.state.knowledge)) {
                    newItem.revealed = true;
                    console.log("revealed upgrade", item.name);
                };
            }
            return newItem;
        })

        this.setState({
            money: this.state.money.plus(payoutMoneyThisTick),
            knowledge: this.state.knowledge.plus(payoutKnowledgeThisTick),
            businesses: newBusinesses,
            upgrades: newUpgrades,
            lifetimeEarnings: newLifetimeEarnings,
        });
    }

    clickBusiness(bus) {
        console.log("business click ", bus.name);
        const busCost = ComputeFunc.getCost(bus, this.state.purchaseAmt, this.state.money);

        let newBusinesses = this.state.businesses.map(item => {
            let newItem = { ...item };
            if (newItem.name === bus.name) {
                newItem.owned += busCost.num;
                console.log("adding", busCost.num, "to", newItem.name);
            }
            return newItem;
        });
        console.log(bus.name, "owned set to", bus.owned + busCost.num);

        let newMilestone = this.state.timeMilestone;
        const curIdx = ComputeFunc.timeMilestoneIdx(this.state.timeMilestone);
        const newLowest = newBusinesses.reduce((min, bus) =>
            bus.owned < min ? bus.owned : min,
            Number.MAX_SAFE_INTEGER);
        const newIdx = ComputeFunc.timeMilestoneIdx(newLowest);
        // console.log("newIdx:",newIdx," curIdx:",curIdx);

        /* apply time modifiers if new time milestone reached */
        if (newIdx > curIdx) {
            newMilestone = ComputeFunc.getMilestone(newIdx);
            console.log("new owned milestone:", newMilestone);
            newBusinesses = newBusinesses.map(item => {
                let newItem = { ...item };
                newItem.timeAdjusted = Business.getAdjustedTimeBase(item, newMilestone);
                console.log(newItem.name, "timeAdjusted now", newItem.timeAdjusted);
                return newItem;
            });
        }

        this.setState((state, props) => ({
            businesses: newBusinesses,
            money: state.money.minus(busCost.cost),
            timeMilestone: newMilestone,
        }))
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
                console.log(this.state.businesses[busIdx].name, "received multiplier", upg.rewardValue);
                break;
            default:
                console.log("unknown rewardType");
                break;
        }

    }

    clickBonus(bonus) {
        console.log("bonus click ", bonus.name);

        const idx = this.state.bonuses.findIndex(btest => btest.name === bonus.name);
        this.setState({
            upgrades: update(this.state.bonuses, {
                [idx]: {
                    ack: { $set: true },
                }
            }),
        });

    }

    announce() {
        
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

                <Tabs
                    className="react-tabs-container"
                    selectedIndex={this.state.tabIndex}
                    onSelect={tabIndex => this.setState({ tabIndex })}>

                    <div id="tabs">
                        <TabList className="tab-list">
                            <Tab className="tab-list-item">Businesses</Tab>
                            <Tab className="tab-list-item">Probes</Tab>
                        </TabList>
                    </div>

                    <TabPanel className="react-tabs__tab-panel main-tab-panel">

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

                                <span className="buyx-prefix">Buy {HelperConst.multiplySymbol}</span>
                                <Dropdown
                                    options={HelperConst.purchaseOpts}
                                    onChange={this.purchaseAmtDropDownHandler}
                                    value={this.state.purchaseAmt}
                                    placeholder="Select an option" />
                            </div>
                            <button className="pause-button" onClick={this.pause}>Pause</button>
                            <button className="pause-button" onClick={this.resume}>Resume</button>
                            <button className="reset-button" onClick={this.resetAll}>RESET</button>
                            <button
                                className="prestige-button"
                                disabled={this.state.prestigeNext.gt(0) ? false : true}
                                onClick={this.prestige}>Prestige</button>
                            {/* <button className="test-give-prestige"
                                onClick={this.prestigeCheat}>+{this.cheatPrestigeVal} prestige</button> */}

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

                    </TabPanel>

                    <TabPanel className="react-tabs__tab-panel probe-tab-panel">

                        <div id="right-sidebar">

                            <div className="purchaseAmts">

                                <span className="buyx-prefix">Buy {HelperConst.multiplySymbol}</span>
                                <Dropdown
                                    options={HelperConst.purchaseOpts}
                                    onChange={this.purchaseAmtDropDownHandler}
                                    value={this.state.purchaseAmt}
                                    placeholder="Select an option" />
                            </div>
                            <button className="pause-button" onClick={this.pause}>Pause</button>
                            <button className="pause-button" onClick={this.resume}>Resume</button>
                            <button className="reset-button" onClick={this.resetAll}>RESET</button>
                            <button
                                className="prestige-button"
                                disabled={this.state.prestigeNext.gt(0) ? false : true}
                                onClick={this.prestige}>Prestige</button>
                            {/* <button className="test-give-prestige"
                                onClick={this.prestigeCheat}>+{this.cheatPrestigeVal} prestige</button> */}

                        </div>

                        <div id="probecontent">
                            <div className="probecontainer">

                                text for panel 2

                            </div>

                        </div>
                    </TabPanel>

                </Tabs>

                <div id="footer">

                    footer

                </div>

                <div id="announce">
                    <Announce announcements={this.state.announcements} />
                </div>
            </div>

        )
    }




}

// =====================================================


