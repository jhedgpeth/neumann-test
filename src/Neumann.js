import React from 'react';
// import ReactDOM from 'react-dom'
import update from 'immutability-helper';
import Dropdown from 'react-dropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import Slider from 'rc-slider';

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
import Sliders from './Sliders';

const Decimal = require('decimal.js');
const mylog = HelperConst.DebugLog;

// =====================================================
export default class Neumann extends React.Component {

    constructor(props) {
        super(props);

        this.state = { ...NeumannInit.freshState() };
        this.userSettings = { ...NeumannInit.userSettings() };

        this.timerRunning = false;
        this.state.pauseClass = "testbutton pause-button ";
        this.timeInterval = 100;
        this.timeMultiplier = this.timeInterval / 1000;
        this.lastLoop = Date.now();

        this.announceCt = 0;
        this.overlayCt = 0;

        this.gameIntervalId = null;
        this.prestigeIntervalId = null;
        this.gameSaveIntervalId = null;

        this.domRefs = [];
        this.purchaseAmt = "1";
        this.tabIndex = 0;


        // this.probe = new Probe(new Decimal(0), 0, 0, 0);
        this.zoomLevel = 0;
        this.zoomName = HelperConst.spaceZoomLevelNames[0];
        this.mapDistance = HelperConst.spaceZoomLevels[0];

        this.sliderInfo = {
            rangeSettings: Sliders.getRangeValues(1),
            probePcts: [50, 50, 0],
            probeSpendPct: 100,
        }

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
        this.sliderChange = this.sliderChange.bind(this);
        this.rangeChange = this.rangeChange.bind(this);
        this.enableFeature = this.enableFeature.bind(this);
        this.purchaseProbe = this.purchaseProbe.bind(this);


        /* cheats */
        this.prestigeCheat = this.prestigeCheat.bind(this);
        this.cheatPrestigeVal = "1e9";

    }

    setTitle() {
        document.title = "NEUMANN $"
            + HelperConst.showNum(this.userSettings.money)
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
        this.centerEllipseRef = null;
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
        this.userSettings = { ...NeumannInit.userSettings() };
        this.announceCt = 0;
        this.populateDomRefs();
        this.outerEllipseMoving = false;
        this.pulseMoving = false;
        this.zoomLevel = 0;
        this.zoomName = HelperConst.spaceZoomLevelNames[0];
        this.mapDistance = HelperConst.spaceZoomLevels[0];
        this.resume();
    }

    restart() {
        this.pause();
        this.setState((state, props) => ({
            ...NeumannInit.freshState()
        }));
        this.userSettings = { ...NeumannInit.userSettings() };
        this.populateDomRefs();
        this.zoomLevel = 0;
        this.zoomName = HelperConst.spaceZoomLevelNames[0];
        this.mapDistance = HelperConst.spaceZoomLevels[0];
        this.resume();
    }

    pause() {
        this.timerRunning = false;
        this.setState((state) => ({
            pauseClass: "testbutton pause-button lit",
        }));
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
        mylog("set timeRunning to", this.timerRunning);
    }

    resume() {
        this.timerRunning = true;
        this.setState((state) => ({
            pauseClass: "testbutton pause-button ",
        }));
        if (!this.gameIntervalId) {
            this.gameIntervalId = setInterval(this.updateGame, this.timeInterval);
        }
        if (!this.prestigeIntervalId) {
            this.prestigeIntervalId = setInterval(this.updatePrestigeEarned, 1000);
        }
        if (!this.gameSaveIntervalId) {
            // this.gameSaveIntervalId = setInterval(this.saveGame, 10000);
        }
        this.lastLoop = Date.now();
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
        // const newPrestigeNext = ComputeFunc.calcPrestigeEarned(this.userSettings.lifetimeEarnings);
        const newPrestigeNext = ComputeFunc.calcPrestigeEarnedFromMax(this.userSettings.curMaxMoney).minus(this.userSettings.prestige.num);
        if (newPrestigeNext.gt(0) && !newPrestigeNext.eq(this.userSettings.prestigeNext)) {
            // mylog("newPrestigeNext:",newPrestigeNext.toFixed(9),"prestigeNext:",this.userSettings.prestigeNext.toFixed(9));
            this.setState({
                prestigeNext: newPrestigeNext,
            })
        }
        // mylog("maxMoney:",this.userSettings.curMaxMoney.toFixed());
        // mylog("lifetime:",this.userSettings.lifetimeEarnings.toFixed(),"  newprestige:",newPrestigeNext.toFixed());
        // mylog(Decimal.sqrt(this.userSettings.lifetimeEarnings.div(Math.pow(10, 6))).times(150));
    }

    prestige() {
        if (this.userSettings.prestigeNext.gt(0)) {
            this.updatePrestigeEarned();
            const newPrestige = this.userSettings.prestige.num.plus(this.userSettings.prestigeNext);
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
        // mylog(ComputeFunc.maxBuy(this.state.businesses[0], this.userSettings.money).max25);
    }

    prestigeCheat() {
        mylog("CHEAT: adding", this.cheatPrestigeVal, "prestige");
        this.userSettings.prestige.num = this.userSettings.prestige.num.plus(this.cheatPrestigeVal);
    }


    incrementBusinessCounters() {
        let changed = false;
        const newBusinesses = this.state.businesses.map(item => {
            let b = this.userSettings.busStats[item.id];
            // reset if new
            if (b.timeAdj === 1) b.timeAdj = item.timeBase;

            let newItem = { ...item };
            if (b.owned === 0) {
                if (b.revealed && item.timeCounter !== 0) {
                    newItem.timeCounter = 0;
                    changed = true;
                    mylog("resetting ", item.name, " to timeCounter ", newItem.timeCounter);
                }
            } else {
                newItem.payout = 0;
                newItem.timeCounter = newItem.timeCounter + this.timeMultiplier;
                if (newItem.timeCounter >= b.timeAdj) {
                    const numPayouts = Math.floor(newItem.timeCounter / b.timeAdj);
                    newItem.payout = numPayouts;
                    newItem.timeCounter = newItem.timeCounter % b.timeAdj;
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
        this.userSettings.probe.update(this.timeMultiplier);
        // this.setState((state, props) => ({
        //     probeDistance: state.probeDistance.plus(this.mapDistance.times(.001))
        // }));
        // const conv = ComputeFunc.convertDistanceToSpace(this.state.probeDistance);
        // mylog("convertDistanceToSpace:",conv.idx,conv.dist.toNumber());

        const conv = ComputeFunc.convertDistanceToSpace(this.userSettings.probe.distance);
        this.mapDistance = conv.dist;
        this.zoomLevel = conv.idx;
        this.zoomName = conv.name;
        // mylog("conv:",conv);
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
        const busCost = ComputeFunc.getCost(bus, this.userSettings.busStats[bus.id], this.purchaseAmt, this.userSettings.money);
        this.userSettings.money = this.userSettings.money.minus(busCost.cost);
        let b = this.userSettings.busStats[bus.id];


        // add overlays
        let newBusinesses = this.state.businesses.map(item => {
            const newB = this.userSettings.busStats[item.id];
            let newItem = { ...item };
            if (newItem.id === bus.id) {
                let bonusArr = [];
                const ownedMilestones = ComputeFunc.getOwnedMilestonesAttained(newB.owned, newB.owned + busCost.num);
                let busMult = 1;
                ownedMilestones.forEach((milestone) => {
                    busMult *= 2;
                });
                (busMult > 1) && bonusArr.push(this.genOverlayObj("X" + busMult, "ownedBonus"));
                newItem.overlays = this.genOverlayArr(item.overlays, "+" + busCost.num).concat(bonusArr);
                mylog("adding", busCost.num, "to", newItem.name);

            }
            return newItem;
        });
        /* for overlays */
        this.setState((state, props) => ({
            businesses: newBusinesses,
        }));
        b.owned += busCost.num;
        mylog(bus.name, "owned set to", b.owned);


        /* total buy milestones */
        const curIdx = ComputeFunc.getTotalMilestoneIdx(this.userSettings.buyMilestone);
        const newLowest = Object.keys(this.userSettings.busStats).reduce((min, bus) =>
            this.userSettings.busStats[bus].owned < min ? this.userSettings.busStats[bus].owned : min,
            Number.MAX_SAFE_INTEGER);
        const newIdx = ComputeFunc.getTotalMilestoneIdx(newLowest);
        // mylog("newIdx:",newIdx," curIdx:",curIdx);

        /* apply time modifiers if new total milestone reached */
        if (newIdx > curIdx) {
            this.userSettings.buyMilestone = ComputeFunc.getTotalMilestone(newIdx);
            mylog("new owned milestone:", this.userSettings.buyMilestone);
            // update adjusted cycle time
            this.state.businesses.forEach((item, idx) => {
                this.userSettings.busStats[item.id].timeAdj = Business.getAdjustedTimeBase(item, newIdx);
                mylog(this.state.businesses[idx].name, "timeAdjusted now", this.userSettings.busStats[item.id].timeAdj);
            });
            ComputeFunc.getTotalMilestonesAttained(curIdx, newIdx).forEach((num) => {
                this.announce("All businesses at " + num + "! Speed Doubled!");
            })

        }


    }

    enableFeature(feature) {
        mylog("feature click ", feature.name);
        this.userSettings.upgStats[feature.id].purchased = true;
        this.userSettings.featureEnabled[feature.rewardTarget] = true;
        mylog("feature enabled:", feature.rewardTarget);
    }

    clickUpgrade(upg) {
        mylog("upgrade click ", upg.name);
        this.userSettings.upgStats[upg.id].purchased = true;

        switch (upg.costType) {
            case "money":
                this.userSettings.money = this.userSettings.money.minus(upg.costValue);
                break;
            case "knowledge":
                this.userSettings.knowledge = this.userSettings.knowledge.minus(upg.costValue);
                break;
            default:
                break;
        }

        switch (upg.rewardType) {
            case "upgradeMult":
                this.userSettings.busStats[upg.rewardTarget].payoutAdj *= upg.rewardValue;
                this.addOverlay(upg.rewardTarget, "x" + upg.rewardValue)
                mylog(this.state.businesses[upg.rewardTarget].name, "received multiplier", upg.rewardValue);
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

    addOverlay(busIdx, text) {
        const bus = this.state.businesses[busIdx];
        mylog("addOverlay click ", text, bus.name);
        this.setState((state, props) => ({
            businesses: update(state.businesses, {
                [busIdx]: {
                    overlays: {
                        $set: this.genOverlayArr(bus.overlays, text),
                    }
                },
            }),
        }));
    }

    changeTabs(idx) {
        this.tabIndex = idx;
    }

    sliderChange(value) {
        mylog("slider change:", value);
        this.sliderInfo.probeSpendPct = value;
    }
    rangeChange(value) {
        // mylog("range change:", value);
        if (this.sliderInfo.rangeSettings.rangeCt === 2) {
            this.sliderInfo.rangeSettings.distribRange = [0, value[1], 100];
        } else if (this.sliderInfo.rangeSettings.rangeCt === 3) {
            this.sliderInfo.rangeSettings.distribRange = [0, value[1], value[2], 100];
        }
        this.sliderInfo.probePcts = this.reportRangePcts();
        // mylog("fixed range:", this.distribRange);
    }
    reportRangePcts() {
        let pSpeedPct, pQualityPct, pCombatPct = 0;
        if (this.sliderInfo.rangeSettings.rangeCt === 1) {
            pSpeedPct = 100;
        } else if (this.sliderInfo.rangeSettings.rangeCt === 2) {
            pSpeedPct = Math.floor(this.sliderInfo.rangeSettings.distribRange[1]);
            pQualityPct = 100 - pSpeedPct;

        } else if (this.sliderInfo.rangeSettings.rangeCt === 3) {
            pSpeedPct = Math.floor(this.sliderInfo.rangeSettings.distribRange[1]);
            pQualityPct = Math.floor(this.sliderInfo.rangeSettings.distribRange[2] - pSpeedPct);
            pCombatPct = 100 - (pSpeedPct + pQualityPct);
        }
        return [pSpeedPct, pQualityPct, pCombatPct];
    }

    purchaseProbe() {
        const pCost = ComputeFunc.getPct(this.userSettings.money, this.sliderInfo.probeSpendPct);
        const pcts = this.reportRangePcts();
        mylog("probe cost:", pCost.toNumber());
        mylog("probe attrs - pSpeed:", pcts[0], "pQuality:", pcts[1], "pCombat:", pcts[2]);
        this.userSettings.probe = new Probe(pCost, pcts[0], pcts[1], pcts[2])

        // test change to 3 settings
        this.sliderInfo.rangeSettings = Sliders.getRangeValues(3);
        this.sliderInfo.probePcts = this.reportRangePcts();
    }

    updateGame() {

        const now = Date.now();
        const dt = now - this.lastLoop;
        this.lastLoop = now;
        this.timeMultiplier = dt / 1000;
        this.fpsPct = Math.floor((100 / dt) * 100);
        // mylog("dt:",dt,"this.fpsPct:",this.fpsPct);

        this.incrementBusinessCounters();
        this.incrementProbeDistance();
        this.incrementAnnouncementCounters();

        const payoutMoneyThisTick = Business.getAllPayouts(this.state.businesses, this.userSettings);
        this.userSettings.lifetimeEarnings = this.userSettings.lifetimeEarnings.plus(payoutMoneyThisTick);
        // mylog("payoutMoneyThisTick:",payoutMoneyThisTick.toFixed());

        // const payoutKnowledgeThisTick = ComputeFunc.totalPayout(this.state.probes, this.userSettings.prestige);
        const payoutKnowledgeThisTick = new Decimal(0);

        /* reveal businesses if money reached */
        this.state.businesses.forEach(item => {
            let b = this.userSettings.busStats[item.id];
            if (!b.revealed) {
                if (item.costType === "money" && item.initialVisible.lte(this.userSettings.money)) {
                    b.revealed = true;
                    mylog("revealed business", item.name);
                };
                if (item.costType === "knowledge" && item.initialVisible.lte(this.userSettings.knowledge)) {
                    b.revealed = true;
                    mylog("revealed business", item.name);
                };
            }
        })
        /* reveal upgrades if resource reached */
        this.state.upgrades.forEach(item => {
            let u = this.userSettings.upgStats[item.id];
            if (!u.revealed) {
                if (item.watchType === "money" && item.watchValue.lte(this.userSettings.money)) {
                    u.revealed = true;
                    mylog("revealed upgrade", item.name);
                };
                if (item.watchType === "knowledge" && item.watchValue.lte(this.userSettings.knowledge)) {
                    u.revealed = true;
                    mylog("revealed upgrade", item.name);
                };
                if (item.watchType === "businessOwned" && this.userSettings.busStats[item.watchTarget].owned >= item.watchValue) {
                    u.revealed = true;
                    mylog("revealed upgrade", item.name);
                }
            }
        });

        this.userSettings.money = this.userSettings.money.plus(payoutMoneyThisTick);
        if (this.userSettings.money.gt(this.userSettings.curMaxMoney)) {
            this.userSettings.curMaxMoney = this.userSettings.money;
        }
        this.userSettings.knowledge = this.userSettings.knowledge.plus(payoutKnowledgeThisTick);

        this.setTitle();
    }

    getTabList() {
        let rows = [];
        rows.push(<Tab className="tab-list-item" key="business-tab">Business</Tab>);
        this.userSettings.featureEnabled['Satellite'] && rows.push(<Tab className="tab-list-item" key="probe-tab">Space</Tab>);

        return (
            <div id="tabs">
                <TabList className="tab-list">
                    {rows}
                </TabList>
            </div>
        )
    }

    getProbeTab() {
        let probebutton, probeattribs, sliderattribs, offlinetext;
        let sliderText = "Spend %";

        if (this.userSettings.featureEnabled["Self-Replication Machinery"]) {
            offlinetext = "";
            probebutton = (
                <button className="probe-purchase"
                    onClick={this.purchaseProbe}>
                    Purchase Probe: ${HelperConst.showNum(ComputeFunc.getPct(this.userSettings.money, this.sliderInfo.probeSpendPct))}
                </button>
            );
            if (this.sliderInfo.rangeSettings.rangeCt === 1) {
                probeattribs = <div className="probe-attribs"></div>
                sliderattribs =
                    <div className="sliderattribs">
                        <span className="probe-prod-span">Probe Production</span>
                        <div className="sliderHeader">{sliderText}</div>
                        <div className="sliderContainer">
                            {Sliders.getSlider(this.sliderInfo, this.sliderChange)}
                        </div>
                    </div>
            } else if (this.sliderInfo.rangeSettings.rangeCt === 2) {
                probeattribs =
                    <div className="probe-attribs">
                        <div className="probe-attrib speed-header">Speed</div>
                        <div className="probe-attrib quality-header">Quality</div>
                        <div></div>
                        <div className="probe-attrib probe-speed">{this.sliderInfo.probePcts[0]}%</div>
                        <div className="probe-attrib probe-quality">{this.sliderInfo.probePcts[1]}%</div>
                        <div></div>
                    </div>
                sliderattribs =
                    <div className="sliderattribs">
                        <span className="probe-prod-span">Probe Production</span>
                        <div className="sliderHeader">{sliderText}</div>
                        <div className="sliderContainer">
                            {Sliders.getSlider(this.sliderInfo, this.sliderChange)}
                        </div>
                        <div className="sliderHeader">Distribute Funds</div>
                        <div className="sliderContainer">
                            {Sliders.getRange(this.sliderInfo, this.rangeChange)}
                        </div>
                    </div>
            } else {
                probeattribs =
                    <div className="probe-attribs">
                        <div className="probe-attrib speed-header">Speed</div>
                        <div className="probe-attrib quality-header">Quality</div>
                        <div className="probe-attrib combat-header">Combat</div>
                        <div className="probe-attrib probe-speed">{this.sliderInfo.probePcts[0]}%</div>
                        <div className="probe-attrib probe-quality">{this.sliderInfo.probePcts[1]}%</div>
                        <div className="probe-attrib probe-combat">{this.sliderInfo.probePcts[2]}%</div>
                    </div>
                sliderattribs =
                    <div className="sliderattribs">
                        <span className="probe-prod-span">Probe Production</span>
                        <div className="sliderHeader">{sliderText}</div>
                        <div className="sliderContainer">
                            {Sliders.getSlider(this.sliderInfo, this.sliderChange)}
                        </div>
                        <div className="sliderHeader">Distribute Funds</div>
                        <div className="sliderContainer">
                            {Sliders.getRange(this.sliderInfo, this.rangeChange)}
                        </div>
                    </div>
            }
        } else {
            offlinetext = <div id="probe-offline">[ OFFLINE ]</div>;
        }

        if (this.userSettings.featureEnabled['Satellite']) {
            return (
                <TabPanel className="react-tabs__tab-panel probe-tab-panel">

                    <div id="right-sidebar">
                        {offlinetext}
                        {sliderattribs}
                        {probeattribs}
                        {probebutton}
                    </div>

                    <Space
                        probe={this.userSettings.probe}
                        timeMultiplier={this.timeMultiplier}
                    />

                </TabPanel>
            )
        } else {
            return (<div></div>);
        }
    }

    render() {

        let debugButtons;
        if (HelperConst.DEBUG) {
            debugButtons =
                <div className="debugButtons">
                    <button className={this.state.pauseClass} onClick={this.pause}>Pause</button>
                    <button className={"testbutton pause-button "} onClick={this.resume}>Resume</button>
                    <button className="testbutton reset-button" onClick={this.resetAll}>RESET</button>
                    <button
                        className="testbutton prestige-button"
                        disabled={this.userSettings.prestigeNext.gt(0) ? false : true}
                        onClick={this.prestige}>Prestige</button>
                    <button className="testbutton test-give-prestige"
                        onClick={this.prestigeCheat}>+{this.cheatPrestigeVal} prestige</button>
                    {/* <button className="testbutton announce-button" onClick={() => this.announce("great job winning!  oh boy this is just super.")}>Announce</button>
                    <button className="testbutton overlay-button" onClick={() => this.addOverlay(0, "X2")}>Odd Jobs Overlay</button>
                    <button className="testbutton overlay-button" onClick={() => this.addOverlay(1, "X2")}>Newspaper Overlay</button>
                    <button className="testbutton ref-button" onClick={() => mylog("domRef:", this.state.businesses[0].domRef)}>Odd Job domRef</button>
                    <button className="testbutton ref-button" onClick={() => mylog("domRef2:", this.state.businesses[1].domRef)}>Newspaper domRef</button>
                    <button className="testbutton ref-button" onClick={() => mylog("getRect:", Business.getPosition(this.state.businesses[0].domRef))}>getRect</button> */}

                    <button className="testbutton save-button" onClick={this.saveGame}>SAVE</button>
                    <h3>Zoom Index: {this.zoomLevel}</h3><br />
                    <h3>RangeCt: {this.sliderInfo.rangeSettings.rangeCt}</h3>
                </div>
        }


        return (
            <div id="wrapper">
                <div id="header">

                    <Income
                        knowledge={this.userSettings.knowledge}
                        businesses={this.state.businesses}
                        userSettings={this.userSettings}
                    />

                </div>

                <Tabs
                    className="react-tabs-container"
                    selectedIndex={this.tabIndex}
                    onSelect={idx => this.changeTabs(idx)}>

                    {this.getTabList()}

                    <TabPanel className="react-tabs__tab-panel main-tab-panel">

                        <div className="left-sidebar">

                            <Upgrades
                                upgrades={this.state.upgrades}
                                businesses={this.state.businesses}
                                userSettings={this.userSettings}
                                onClick={this.clickUpgrade}
                                enableFeature={this.enableFeature}
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

                            {debugButtons}
                        </div>

                        <div id="content">
                            <div className="container">

                                <Business
                                    businesses={this.state.businesses}
                                    userSettings={this.userSettings}
                                    purchaseAmt={this.purchaseAmt}
                                    onClick={this.clickBusiness}
                                    domRefs={this.domRefs}
                                />


                            </div>

                        </div>

                    </TabPanel>

                    {this.getProbeTab()}

                </Tabs>

                <div id="footer">

                    <div id="version">v. 0.0.1</div>
                    <div id="fps">fps:{this.fpsPct}%</div>

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


