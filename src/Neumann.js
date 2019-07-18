import React from 'react';
// import ReactDOM from 'react-dom'
import update from 'immutability-helper';
import Dropdown from 'react-dropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Slider from 'rc-slider';

// import { compress as lzStringCompress, decompress as lzStringDecompresss } from 'lz-string';
import { compress as lzStringCompress } from 'lz-string';

import './styles/fonts.css';
import './styles/index.scss';
import './styles/dropdown.scss';
import './styles/effects.scss';
import './styles/space.scss';
import 'rc-slider/assets/index.css';

import Space from './Space';
import Income from './Income';
import Business from './Business.js';
import Probe from './Probe.js';
import NeumannInit from './objInit/NeumannInit';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import Upgrades from './Upgrades';
import Announce from './Announce';

const Decimal = require('decimal.js');
const mylog = HelperConst.DebugLog;
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const MyRange = createSliderWithTooltip(Slider.Range);
const MySlider = createSliderWithTooltip(Slider);

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
        this.tabIndex = 0;

        this.probe = new Probe(new Decimal(0), 0,0,0);
        this.zoomLevel = 0;
        this.zoomName = HelperConst.spaceZoomLevelNames[0];
        this.mapDistance = HelperConst.spaceZoomLevels[0];

        this.rangeSettings = Space.getRangeValues(2);
        this.distribRange = this.rangeSettings.distribRange;
        this.probeSpendPct = 1;
        this.sliderMarks = {
            0: '0',
            25: '25%',
            50: '50%',
            75: '75%',
            100: '100%'
        };


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
        this.sliderChange = this.sliderChange.bind(this);
        this.rangeChange = this.rangeChange.bind(this);
        this.purchaseProbe = this.purchaseProbe.bind(this);


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
        mylog("game didmount");
        this.resetAll();

        mylog(HelperConst.purchaseOptsSpecial);
        mylog(HelperConst.spaceZoomLevels.map(n => HelperConst.showInt(n)));
    }

    componentWillUnmount() {
        mylog("game willunmount");
        clearInterval(this.gameIntervalId);
        clearInterval(this.prestigeIntervalId);
        clearInterval(this.gameSaveIntervalId);
    }

    componentDidUpdate() {
        // mylog("game didupdate");

    }

    populateDomRefs() {
        this.state.businesses.forEach((bus) => {
            mylog("creating domRef for", bus.name);
            this.domRefs.push({ name: bus.name, domRef: React.createRef() });
        });
        this.probeDivRef = React.createRef();
        this.pulseRef = null;
        this.innerEllipseRef = null;
        this.outerEllipseRef = null;
        this.centerPlanetRef = null;
        mylog("populated domRefs:", this.domRefs);
    }

    resetAll() {
        this.pause();
        this.setState((state, props) => ({
            ...NeumannInit.freshState()
        }));
        this.announceCt = 0;
        this.populateDomRefs();
        this.outerEllipseMoving = false;
        this.pulseMoving = false;
        const conv = ComputeFunc.convertDistanceToSpace(0);
        this.mapDistance = conv.dist;
        this.zoomLevel = conv.idx;
        this.zoomName = conv.name;
        this.resume();
    }

    restart() {
        this.pause();
        this.setState((state) => ({
            ...NeumannInit.coreObjOnly()
        }));
        this.populateDomRefs();
        const conv = ComputeFunc.convertDistanceToSpace(0);
        this.mapDistance = conv.dist;
        this.zoomLevel = conv.idx;
        this.zoomName = conv.name;
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
        mylog("saveString length:", saveString.length);
        localStorage.setItem('neumann_game_save_time', Date.now());
        localStorage.setItem('neumann_game_save', saveString);
        // mylog("saveString:",saveString);
        // mylog("retrieve jeff cookie:", cookie.load('jeff'));
        // // mylog("retrieve money cookie:", cookie.load('money'));
        // mylog("retrieve businesses cookie:", cookie.load('businesses'));

        this.announce("game saved");
    }

    updatePrestigeEarned() {
        // const newPrestigeNext = ComputeFunc.calcPrestigeEarned(this.state.lifetimeEarnings);
        const newPrestigeNext = ComputeFunc.calcPrestigeEarnedFromMax(this.state.curMaxMoney).minus(this.state.prestige.num);
        if (newPrestigeNext.gt(0) && !newPrestigeNext.eq(this.state.prestigeNext)) {
            // mylog("newPrestigeNext:",newPrestigeNext.toFixed(9),"prestigeNext:",this.state.prestigeNext.toFixed(9));
            this.setState({
                prestigeNext: newPrestigeNext,
            })
        }
        // mylog("maxMoney:",this.state.curMaxMoney.toFixed());
        // mylog("lifetime:",this.state.lifetimeEarnings.toFixed(),"  newprestige:",newPrestigeNext.toFixed());
        // mylog(Decimal.sqrt(this.state.lifetimeEarnings.div(Math.pow(10, 6))).times(150));
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
        mylog("received new purchaseAmt:", amt);
        if (HelperConst.purchaseOpts.indexOf(amt) !== -1 && this.purchaseAmt !== amt) {
            this.purchaseAmt = amt;
            mylog("new purchaseAmt:", amt);
        }
        // mylog(this.state.businesses);
        // mylog(this.state.businesses[0]);
        // mylog(ComputeFunc.maxBuy(this.state.businesses[0], this.state.money).max25);
    }

    prestigeCheat() {
        mylog("CHEAT: adding", this.cheatPrestigeVal, "prestige");
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
                    mylog("resetting ", item.name, " to timeCounter ", newItem.timeCounter);
                }
            } else {
                newItem.payout = false;
                newItem.timeCounter = newItem.timeCounter + this.timeMultiplier;
                if (newItem.timeCounter >= newItem.timeAdjusted) {
                    newItem.payout = true;
                    newItem.timeCounter = 0;
                }
                changed = true;
                // mylog(newItem.name, " timeCounter:", newItem.timeCounter, " payout:",newItem.payout);
            }

            // overlays
            const activeOverlays = newItem.overlays.filter(o => o.counter < o.expire);
            // const activeOverlays = newItem.overlays.filter(o => o.counter >= 0);

            newItem.overlays = activeOverlays.map((o, i) => {
                o.counter = o.counter + this.timeMultiplier;
                // mylog("o.counter: #" + i, o.counter);
                return o;
            })
            // newItem.overlays.length > 0 && mylog(item.name,"overlays:", newItem.overlays.length);
            return newItem;
        });
        if (changed) {
            this.setState((state) => ({
                businesses: newBusinesses,
            }))
        }
    }

    incrementProbeDistance() {
        this.probe.update(this.timeMultiplier);
        // this.setState((state, props) => ({
        //     probeDistance: state.probeDistance.plus(this.mapDistance.times(.001))
        // }));
        // const conv = ComputeFunc.convertDistanceToSpace(this.state.probeDistance);
        // mylog("convertDistanceToSpace:",conv.idx,conv.dist.toNumber());

        const conv = ComputeFunc.convertDistanceToSpace(this.probe.distance);
        this.mapDistance = conv.dist;
        this.zoomLevel = conv.idx;
        this.zoomName = conv.name;
    }

    incrementAnnouncementCounters() {
        const valid = this.state.announcements.reduce((result, item) => {
            if (!item.ack || (item.ack && item.counter < item.fadeout)) {
                result.push(item);
            }
            return result;
        }, []);
        // mylog("valid:", valid);
        const newAnnouncements = valid.map(item => {
            let newAnn = { ...item };
            newAnn.counter += this.timeMultiplier;
            if (newAnn.counter >= newAnn.expire) {
                newAnn.ack = true;
                newAnn.counter = 0;
            }
            return newAnn;
        });
        // mylog("newAnnouncements:", newAnnouncements);
        this.setState((state) => ({
            announcements: newAnnouncements,
        }))
    }


    clickBusiness(bus) {
        mylog("business click ", bus.name);
        const busCost = ComputeFunc.getCost(bus, this.purchaseAmt, this.state.money);

        let newBusinesses = this.state.businesses.map(item => {
            let newItem = { ...item };
            if (newItem.name === bus.name) {
                let bonusArr = [];
                const ownedMilestones = ComputeFunc.getOwnedMilestonesAttained(item.owned, item.owned + busCost.num);
                let busMult = 1;
                ownedMilestones.forEach((milestone) => {
                    busMult *= 2;
                });
                (busMult > 1) && bonusArr.push(this.genOverlayObj("X" + busMult + "!", "ownedBonus"));
                newItem.owned += busCost.num;
                newItem.overlays = this.genOverlayArr(item.overlays, "+" + busCost.num).concat(bonusArr);
                mylog("adding", busCost.num, "to", newItem.name);

            }
            return newItem;
        });
        mylog(bus.name, "owned set to", bus.owned + busCost.num);

        let newMilestone = this.state.timeMilestone;
        const curIdx = ComputeFunc.timeMilestoneIdx(this.state.timeMilestone);
        const newLowest = newBusinesses.reduce((min, bus) =>
            bus.owned < min ? bus.owned : min,
            Number.MAX_SAFE_INTEGER);
        const newIdx = ComputeFunc.timeMilestoneIdx(newLowest);
        // mylog("newIdx:",newIdx," curIdx:",curIdx);

        /* apply time modifiers if new time milestone reached */
        if (newIdx > curIdx) {
            newMilestone = ComputeFunc.getTimeMilestone(newIdx);
            mylog("new owned milestone:", newMilestone);
            newBusinesses = newBusinesses.map(item => {
                let newItem = { ...item };
                newItem.timeAdjusted = Business.getAdjustedTimeBase(item, newMilestone);
                mylog(newItem.name, "timeAdjusted now", newItem.timeAdjusted);
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
        mylog("upgrade click ", upg.name);

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
                this.addOverlay(this.state.businesses[busIdx].name, "x" + upg.rewardValue)
                mylog(this.state.businesses[busIdx].name, "received multiplier", upg.rewardValue);
                break;
            default:
                mylog("unknown rewardType");
                break;
        }

    }

    clickAnnouncement(a) {
        mylog("announcement click ", a.id, a.text);
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
        mylog("announce ", text);
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
        mylog("addOverlay called:", text);
        return [...origOverlay, this.genOverlayObj(text, ovType)].slice(-4);
    }

    addOverlay(busName, text) {

        mylog("addOverlay click ", text, busName);
        const idx = this.state.businesses.findIndex(test => test.name === busName);
        mylog("idx:", idx);
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
        mylog("clicked probeTestNextZoom:", ComputeFunc.getSpaceZoomLevelIdx(this.probe.distance) + 1);
        // this.setState((state, props) => ({
        //     probeDistance: ComputeFunc.getSpaceZoomLevel(this.zoomLevel)
        // }));
    }

    sliderChange(value) {
        // mylog("slider change:", value);
        this.probeSpendPct = value;
    }
    rangeChange(value) {
        mylog("range change:", value);
        if (this.rangeSettings.rangeCt === 2) {
            this.distribRange = [0, value[1], 100];
        } else if (this.rangeSettings.rangeCt === 3) {
            this.distribRange = [0, value[1], value[2], 100];
        }
        mylog("fixed range:", this.distribRange);
    }
    reportRangePcts() {
        let pSpeedPct, pQualityPct, pCombatPct = 0;
        if (this.rangeSettings.rangeCt === 2) {
            pSpeedPct = Math.floor(this.distribRange[1]);
            pQualityPct = 100 - pSpeedPct;

        } else if (this.rangeSettings.rangeCt === 3) {
            pSpeedPct = Math.floor(this.distribRange[1]);
            pQualityPct = Math.floor(this.distribRange[2] - pSpeedPct);
            pCombatPct = 100 - (pSpeedPct + pQualityPct);
        }
        return [pSpeedPct, pQualityPct, pCombatPct];
    }

    purchaseProbe() {
        const pCost = ComputeFunc.getPct(this.state.money, this.probeSpendPct);
        const pcts = this.reportRangePcts();
        mylog("probe cost:", pCost.toNumber());
        mylog("probe attrs - pSpeed:", pcts[0], "pQuality:", pcts[1], "pDefense:",pcts[2]);
        this.probe = new Probe(pCost, pcts[0],pcts[1],pcts[2])

        // test change to 3 settings
        this.rangeSettings = Space.getRangeValues(3);
        this.distribRange = this.rangeSettings.distribRange;
    }

    updateGame() {
        this.incrementBusinessCounters();
        this.incrementProbeDistance();
        this.incrementAnnouncementCounters();

        const payoutMoneyThisTick = ComputeFunc.totalPayout(this.state.businesses, this.state.prestige);
        const newLifetimeEarnings = this.state.lifetimeEarnings.plus(payoutMoneyThisTick);
        // mylog("payoutMoneyThisTick:",payoutMoneyThisTick.toFixed());

        // const payoutKnowledgeThisTick = ComputeFunc.totalPayout(this.state.probes, this.state.prestige);
        const payoutKnowledgeThisTick = new Decimal(0);

        /* reveal businesses if money reached */
        const newBusinesses = this.state.businesses.map(item => {
            let newItem = { ...item };
            if (!item.revealed) {
                if (item.costType === "money" && item.initialVisible.lte(this.state.money)) {
                    newItem.revealed = true;
                    mylog("revealed business", item.name);
                };
                if (item.costType === "knowledge" && item.initialVisible.lte(this.state.knowledge)) {
                    newItem.revealed = true;
                    mylog("revealed business", item.name);
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
                    mylog("revealed upgrade", item.name);
                };
                if (item.watchType === "knowledge" && item.watchValue.lte(this.state.knowledge)) {
                    newItem.revealed = true;
                    mylog("revealed upgrade", item.name);
                };
            }
            return newItem;
        })

        const newMoney = this.state.money.plus(payoutMoneyThisTick);
        let newMax = this.state.curMaxMoney;
        if (newMoney.gt(newMax)) {
            newMax = newMoney;
            // mylog("newMax:",newMax.toFixed());
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

    render() {
        return (
            <div id="wrapper">
                <div id="header">

                    <Income
                        money={this.state.money}
                        knowledge={this.state.knowledge}
                        businesses={this.state.businesses}
                        probe={this.probe}
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
                            <button className="testbutton ref-button" onClick={() => mylog("domRef:", this.state.businesses[0].domRef)}>Odd Job domRef</button>
                            <button className="testbutton ref-button" onClick={() => mylog("domRef2:", this.state.businesses[1].domRef)}>Newspaper domRef</button>

                            <button className="testbutton ref-button" onClick={() => mylog("getRect:", Business.getPosition(this.state.businesses[0].domRef))}>getRect</button>

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
                            Probe Distance: {HelperConst.showNum(this.probe.distance)}<br />
                            Map Distance: {HelperConst.showNum(this.mapDistance)}<br />
                            Zoom Index: {this.zoomLevel}<br />
                            <button className="testbutton pause-button" onClick={this.pause}>Pause</button>
                            <button className="testbutton pause-button" onClick={this.resume}>Resume</button>
                            <button className="testbutton reset-button" onClick={this.resetAll}>RESET</button>
                            <button
                                className="testbutton space-button"
                                onClick={this.probeTestNextZoom}>
                                Space Zoom
                            </button>
                            <button className="testbutton announce-button" onClick={() => this.announce("great job winning!  oh boy this is just super.")}>Announce</button>
                            <p>Cost: ${HelperConst.showNum(ComputeFunc.getPct(this.state.money, this.probeSpendPct))}</p>
                            <div className="sliderContainer">
                                <MySlider
                                    // count={1}
                                    min={5}
                                    max={100}
                                    value={this.probeSpendPct}
                                    marks={this.sliderMarks}
                                    step={5}
                                    onChange={this.sliderChange}
                                    defaultValue={5}
                                    trackStyle={[
                                        { backgroundColor: '#1A8A09' },
                                        { backgroundColor: '#555' },
                                    ]}
                                    handleStyle={[
                                        // { backgroundColor: '#1A8A09', border: '0', },
                                        { backgroundColor: '#1A8A09', border: '0', },
                                        { backgroundColor: '#555', border: '0', },
                                    ]}
                                    dotStyle={{
                                        backgroundColor: '#bbb',
                                        border: '0',
                                        width: '4px',
                                    }}
                                    activeDotStyle={{
                                        backgroundColor: '#1A8A09',
                                        border: '0',
                                        width: '4px',
                                    }}
                                    allowCross={false}
                                    // pushable={true}
                                    tipFormatter={value => value + "%"}
                                    tipProps={{ placement: 'bottom' }}
                                />
                            </div>
                            <p>Distribute Funds</p>
                            <div className="sliderContainer">
                                <MyRange
                                    count={this.rangeSettings.rangeCt}
                                    min={0}
                                    max={100}
                                    step={2}
                                    onChange={this.rangeChange}
                                    defaultValue={this.rangeSettings.distribRange}
                                    value={this.distribRange}
                                    trackStyle={this.rangeSettings.trackStyle}
                                    handleStyle={this.rangeSettings.handleStyle}
                                    railStyle={this.rangeSettings.railStyle}
                                    dotStyle={{
                                        backgroundColor: '#bbb',
                                        border: '0',
                                        width: '4px',
                                    }}
                                    allowCross={false}
                                    // pushable={true}
                                    tipFormatter={value => value + "%"}
                                    tipProps={{ placement: 'bottom' }}
                                />
                            </div>
                            <button className="testbutton purchase-button" onClick={this.purchaseProbe}>Purchase Probe</button>
                        </div>

                        <Space
                            probe={this.probe}
                            mapDistance={this.mapDistance}
                            timeMultiplier={this.timeMultiplier}
                            zoomLevel={this.zoomLevel}
                            zoomName={this.zoomName}
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


