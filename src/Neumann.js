import React from 'react';
// import ReactDOM from 'react-dom'
import update from 'immutability-helper';
import Dropdown from 'react-dropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Slider from 'rc-slider';
import { compress as lzStringCompress, decompress as lzStringDecompresss } from 'lz-string';

import './styles/fonts.css';
import './styles/index.scss';
import './styles/dropdown.scss';
import './styles/effects.scss';
import './styles/space.scss';

import Space from './Space';
import Income from './Income';
import Business from './Business.js';
// import Probe from './Probe.js';
import NeumannInit from './objInit/NeumannInit';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import Upgrades from './Upgrades';
import Announce from './Announce';


// =====================================================
export default class Neumann extends React.Component {

    constructor(props) {
        super(props);

        this.state = { ...NeumannInit.freshState() };

        this.timeInterval = 100;
        this.timeMultiplier = this.timeInterval / 1000;

        this.announceCt = 0;
        this.overlayCt = 0;

        this.gameIntervalId = null;
        this.prestigeIntervalId = null;
        this.gameSaveIntervalId = null;

        this.domRefs = [];
        this.purchaseAmt = "1";
        this.tabIndex = 1;

        this.zoomLevel = 0;

        // this._business = React.createRef();
        this.populateBusDomRefs = this.populateDomRefs.bind(this);
        this.restart = this.restart.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.prestige = this.prestige.bind(this);
        this.updatePrestigeEarned = this.updatePrestigeEarned.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.clickBusiness = this.clickBusiness.bind(this);
        this.clickUpgrade = this.clickUpgrade.bind(this);
        this.clickAnnouncement = this.clickAnnouncement.bind(this);
        this.purchaseAmtDropDownHandler = this.purchaseAmtDropDownHandler.bind(this);
        this.announce = this.announce.bind(this);
        this.probeTestNextZoom = this.probeTestNextZoom.bind(this);
        this.setSpaceZoomLevel = this.setSpaceZoomLevel.bind(this);

        /* cheats */
        this.prestigeCheat = this.prestigeCheat.bind(this);
        this.cheatPrestigeVal = "1e9";

    }

    setTitle() {
        document.title = "NEUMANN $"
            + HelperConst.showNum(this.state.money)
            + " " + this.state.version;
    }

    componentDidMount() {
        console.log("game didmount");
        this.resetAll();

        console.log(HelperConst.purchaseOptsSpecial);
        console.log(HelperConst.spaceZoomLevels.map(n => HelperConst.showInt(n)));
    }

    componentWillUnmount() {
        console.log("game willunmount");
        clearInterval(this.gameIntervalId);
        clearInterval(this.prestigeIntervalId);
        clearInterval(this.gameSaveIntervalId);
    }

    componentDidUpdate() {
        // console.log("game didupdate");

    }

    populateDomRefs() {
        this.state.businesses.forEach((bus) => {
            console.log("creating domRef for", bus.name);
            this.domRefs.push({ name: bus.name, domRef: React.createRef() });
        });
        this.probeDivRef = React.createRef();
        this.pulseRef = null;
        this.innerEllipseRef = null;
        this.outerEllipseRef = null;
        this.centerPlanetRef = null;
        console.log("populated domRefs:", this.domRefs);
    }

    resetAll() {
        this.pause();
        this.setState((state) => ({
            ...NeumannInit.freshState()
        }));
        this.announceCt = 0;
        this.populateDomRefs();
        this.outerEllipseMoving = false;
        this.pulseMoving = false;
        this.resume();
    }

    restart() {
        this.pause();
        this.setState((state) => ({
            ...NeumannInit.coreObjOnly()
        }));
        this.populateDomRefs();
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
        if (this.gameSaveIntervalId) {
            clearInterval(this.gameSaveIntervalId);
            delete (this.gameSaveIntervalId)
        }
    }

    resume() {
        if (!this.gameIntervalId) {
            this.gameIntervalId = setInterval(this.updateGame, this.timeInterval);
        }
        if (!this.prestigeIntervalId) {
            this.prestigeIntervalId = setInterval(this.updatePrestigeEarned, 1000);
        }
        if (!this.gameSaveIntervalId) {
            // this.gameSaveIntervalId = setInterval(this.saveGame, 10000);
        }

    }

    loadGame() {

    }

    saveGame() {
        const saveString = lzStringCompress(JSON.stringify(this.state));
        console.log("saveString length:", saveString.length);
        localStorage.setItem('neumann_game_save_time', Date.now());
        localStorage.setItem('neumann_game_save', saveString);
        // console.log("saveString:",saveString);
        // console.log("retrieve jeff cookie:", cookie.load('jeff'));
        // // console.log("retrieve money cookie:", cookie.load('money'));
        // console.log("retrieve businesses cookie:", cookie.load('businesses'));

        this.announce("game saved");
    }

    updatePrestigeEarned() {
        // const newPrestigeNext = ComputeFunc.calcPrestigeEarned(this.state.lifetimeEarnings);
        const newPrestigeNext = ComputeFunc.calcPrestigeEarnedFromMax(this.state.curMaxMoney).minus(this.state.prestige.num);
        if (newPrestigeNext.gt(0) && !newPrestigeNext.eq(this.state.prestigeNext)) {
            // console.log("newPrestigeNext:",newPrestigeNext.toFixed(9),"prestigeNext:",this.state.prestigeNext.toFixed(9));
            this.setState({
                prestigeNext: newPrestigeNext,
            })
        }
        // console.log("maxMoney:",this.state.curMaxMoney.toFixed());
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
        if (HelperConst.purchaseOpts.indexOf(amt) !== -1 && this.purchaseAmt !== amt) {
            this.purchaseAmt = amt;
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


    incrementBusinessCounters() {
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

            // overlays
            const activeOverlays = newItem.overlays.filter(o => o.counter < o.expire);
            // const activeOverlays = newItem.overlays.filter(o => o.counter >= 0);

            newItem.overlays = activeOverlays.map((o, i) => {
                o.counter = o.counter + this.timeMultiplier;
                // console.log("o.counter: #" + i, o.counter);
                return o;
            })
            // newItem.overlays.length > 0 && console.log(item.name,"overlays:", newItem.overlays.length);
            return newItem;
        });
        if (changed) {
            this.setState((state) => ({
                businesses: newBusinesses,
            }))
        }
    }

    incrementAnnouncementCounters() {
        const valid = this.state.announcements.reduce((result, item) => {
            if (!item.ack || (item.ack && item.counter < item.fadeout)) {
                result.push(item);
            }
            return result;
        }, []);
        // console.log("valid:", valid);
        const newAnnouncements = valid.map(item => {
            let newAnn = { ...item };
            newAnn.counter += this.timeMultiplier;
            if (newAnn.counter >= newAnn.expire) {
                newAnn.ack = true;
                newAnn.counter = 0;
            }
            return newAnn;
        });
        // console.log("newAnnouncements:", newAnnouncements);
        this.setState((state) => ({
            announcements: newAnnouncements,
        }))
    }


    updateGame() {
        this.incrementBusinessCounters();
        this.incrementAnnouncementCounters();

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

        const newMoney = this.state.money.plus(payoutMoneyThisTick);
        let newMax = this.state.curMaxMoney;
        if (newMoney.gt(newMax)) {
            newMax = newMoney;
            // console.log("newMax:",newMax.toFixed());
        }

        this.setState((state) => ({
            money: newMoney,
            knowledge: state.knowledge.plus(payoutKnowledgeThisTick),
            businesses: newBusinesses,
            upgrades: newUpgrades,
            lifetimeEarnings: newLifetimeEarnings,
            curMaxMoney: newMax,
        }));

        this.setTitle();
    }

    clickBusiness(bus) {
        console.log("business click ", bus.name);
        const busCost = ComputeFunc.getCost(bus, this.purchaseAmt, this.state.money);

        let newBusinesses = this.state.businesses.map(item => {
            let newItem = { ...item };
            if (newItem.name === bus.name) {
                let bonusArr = [];
                const ownedMilestones = ComputeFunc.getOwnedMilestonesAttained(item.owned, item.owned + busCost.num);
                ownedMilestones.forEach((milestone) => {
                    bonusArr.push(this.genOverlayObj("X2!", "ownedBonus"));
                })
                newItem.owned += busCost.num;
                newItem.overlays = this.genOverlayArr(item.overlays, "+" + busCost.num).concat(bonusArr);
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
            newMilestone = ComputeFunc.getTimeMilestone(newIdx);
            console.log("new owned milestone:", newMilestone);
            newBusinesses = newBusinesses.map(item => {
                let newItem = { ...item };
                newItem.timeAdjusted = Business.getAdjustedTimeBase(item, newMilestone);
                console.log(newItem.name, "timeAdjusted now", newItem.timeAdjusted);
                return newItem;
            });
            ComputeFunc.getTimeMilestonesAttained(curIdx, newIdx).forEach((num) => {
                this.announce(num + " all businesses! Speed Doubled!");
            })

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
                this.addOverlay(this.state.businesses[busIdx], "x" + upg.rewardValue)
                console.log(this.state.businesses[busIdx].name, "received multiplier", upg.rewardValue);
                break;
            default:
                console.log("unknown rewardType");
                break;
        }

    }

    clickAnnouncement(a) {
        console.log("announcement click ", a.id, a.text);
        const idx = this.state.announcements.findIndex(atest => atest.id === a.id);
        this.setState({
            announcements: update(this.state.announcements, {
                [idx]: {
                    ack: { $set: true },
                    counter: { $set: 0 },
                }
            }),
        });


    }

    announce(text) {
        console.log("announce ", text);
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
        this.setState((state) => ({
            announcements: [...state.announcements, {
                id: this.announceCt++,
                createTime: time,
                text: text,
                counter: 0,
                expire: 3,
                fadeout: 0.4,
                ack: false,
            },],
        }))
    }

    genOverlayObj(text, ovType = "generic") {
        const xAdj = Math.floor((Math.random() * 40)) - 20;
        const yAdj = Math.floor((Math.random() * 20)) - 10;
        return {
            id: "overlay" + this.overlayCt++,
            expire: 1,
            counter: 0,
            ovType: ovType,
            xTarget: xAdj,
            yTarget: yAdj,
            text: text,
        }
    }

    genOverlayArr(origOverlay, text, ovType = "generic") {
        console.log("addOverlay called:", text);
        return [...origOverlay, this.genOverlayObj(text, ovType)];
    }

    addOverlay(busName, text) {

        console.log("addOverlay click ", text, busName);
        const idx = this.state.businesses.findIndex(test => test.name === busName);
        console.log("idx:", idx);
        this.setState((state, props) => ({
            businesses: update(state.businesses, {
                [idx]: {
                    overlays: {
                        $set: this.genOverlayArr(state.businesses[idx].overlays, text),
                    }
                },
            }),
        }));
    }

    changeTabs(idx) {
        this.tabIndex = idx;
    }

    probeTestNextZoom() {
        this.setState((state, props) => ({
            probeDistance: HelperConst.spaceZoomLevels[HelperConst.getSpaceZoomLevelIdx(this.state.probeDistance)]
        }));
    }

    setSpaceZoomLevel(n) {
        console.log("n:", n);
        this.zoomLevel = n;
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
                    selectedIndex={this.tabIndex}
                    onSelect={idx => this.changeTabs(idx)}>

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
                                    value={this.purchaseAmt}
                                    placeholder="Select an option" />
                            </div>
                            <button className="testbutton pause-button" onClick={this.pause}>Pause</button>
                            <button className="testbutton pause-button" onClick={this.resume}>Resume</button>
                            <button className="testbutton reset-button" onClick={this.resetAll}>RESET</button>
                            <button
                                className="testbutton prestige-button"
                                disabled={this.state.prestigeNext.gt(0) ? false : true}
                                onClick={this.prestige}>Prestige</button>
                            <button className="testbutton test-give-prestige"
                                onClick={this.prestigeCheat}>+{this.cheatPrestigeVal} prestige</button>
                            <button className="testbutton announce-button" onClick={() => this.announce("great job winning!  oh boy this is just super.")}>Announce</button>
                            <button className="testbutton overlay-button" onClick={() => this.addOverlay({ name: "Odd Jobs" }, "X2")}>Odd Jobs Overlay</button>
                            <button className="testbutton overlay-button" onClick={() => this.addOverlay({ name: "Newspaper Delivery" }, "X2")}>Newspaper Overlay</button>
                            <button className="testbutton ref-button" onClick={() => console.log("domRef:", this.state.businesses[0].domRef)}>Odd Job domRef</button>
                            <button className="testbutton ref-button" onClick={() => console.log("domRef2:", this.state.businesses[1].domRef)}>Newspaper domRef</button>

                            <button className="testbutton ref-button" onClick={() => console.log("getRect:", Business.getPosition(this.state.businesses[0].domRef))}>getRect</button>

                            <button className="testbutton save-button" onClick={this.saveGame}>SAVE</button>

                        </div>

                        <div id="content">
                            <div className="container">

                                <Business
                                    businesses={this.state.businesses}
                                    purchaseAmt={this.purchaseAmt}
                                    money={this.state.money}
                                    prestige={this.state.prestige}
                                    onClick={this.clickBusiness}
                                    domRefs={this.domRefs}
                                />


                            </div>

                        </div>

                    </TabPanel>

                    <TabPanel className="react-tabs__tab-panel probe-tab-panel">

                        <div id="right-sidebar">
                            Probe Distance: {HelperConst.showNum(this.state.probeDistance)}<br />
                            Map Distance: {HelperConst.showNum(HelperConst.spaceZoomLevels[HelperConst.getSpaceZoomLevelIdx(this.state.probeDistance)])}<br />
                            Zoom Index: {HelperConst.getSpaceZoomLevelIdx(this.state.probeDistance)}<br />
                            <button
                                className="testbutton space-button"
                                onClick={this.probeTestNextZoom}>
                                Space Zoom
                            </button>

                        </div>

                        <Space
                            probeDistance={this.state.probeDistance}
                            timeMultiplier={this.timeMultiplier}
                            zoomLevel={this.zoomLevel}
                            setSpaceZoomLevel={this.setSpaceZoomLevel}
                        />

                    </TabPanel>

                </Tabs>

                <div id="footer">

                    v. 0.0.1

                </div>

                <div id="announcements">
                    <Announce
                        announcements={this.state.announcements}
                        onClick={this.clickAnnouncement}
                    />
                </div>
            </div>

        )
    }




}

// =====================================================


