import React from 'react';
// import ReactDOM from 'react-dom'
import SecureLS from 'secure-ls';
import update from 'immutability-helper';
import Modal from 'react-modal';
import Dropdown from 'react-dropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import Slider from 'rc-slider';

// import { compress as lzStringCompress, decompress as lzStringDecompress } from 'lz-string';
// import { compress as lzStringCompress } from 'lz-string';

import './styles/fonts.css';
import './styles/index.scss';
import './styles/dropdown.scss';
import './styles/modal.scss';
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
import Settings from './Settings';
import Prestige from './Prestige';

const Decimal = require('decimal.js');
const mylog = HelperConst.DebugLog;

// =====================================================
export default class Neumann extends React.Component {

    constructor(props) {
        super(props);

        this.state = { ...NeumannInit.freshState() };
        this.state.helpModalIsOpen = false;

        this.userSettings = { ...NeumannInit.userSettings() };

        this.timerRunning = false;
        this.state.pauseClass = "sidebarButtons fancyButtons pause-button ";
        this.timeInterval = 100;
        this.timeMultiplier = this.timeInterval / 1000;
        this.lastLoop = Date.now();


        this.gameSavedHide = <div id="savegame"></div>;
        this.gameSavedNotify = <div id="savegame" className="game-saved">Game Saved</div>
        this.gameSavedCountdown = 5;
        this.gameSavedObj = {
            content: this.gameSavedHide,
            countdown: this.gameSavedCountdown,
        };

        this.announceCt = 0;
        this.overlayCt = 0;
        this.modalCt = 0;

        this.gameIntervalId = null;
        this.prestigeIntervalId = null;
        this.gameSaveIntervalId = null;

        this.domRefs = [];
        this.purchaseAmt = "1";
        this.tabIndex = 0;


        // this.probe = new Probe(new Decimal(0), 0, 0, 0);
        this.zoomLevel = 0;
        this.zoomName = Space.spaceZoomLevelNames[0];
        this.mapDistance = Space.spaceZoomLevels[0];

        this.sliderInfo = {
            rangeSettings: Sliders.getRangeValues(1),
            probePcts: [50, 50, 0],
            probeSpendPct: 25,
        }

        // this._business = React.createRef();
        this.populateBusDomRefs = this.populateInitVals.bind(this);
        this.restart = this.restart.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.loadGame = this.loadGame.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.decrementSavedGameObj = this.decrementSavedGameObj.bind(this);
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
        this.getSettingsTab = this.getSettingsTab.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
        this.clickConcentrate = this.clickConcentrate.bind(this);
        this.decrementConcentrate = this.updateConcentrate.bind(this);

        this.openHelpModal = this.openHelpModal.bind(this);
        this.closeHelpModal = this.closeHelpModal.bind(this);
        this.afterOpenHelpModal = this.afterOpenHelpModal.bind(this);


        /* cheats */
        this.prestigeCheat = this.prestigeCheat.bind(this);
        this.moneyCheat = this.moneyCheat.bind(this);
        this.cheatPrestigeVal = "1e9";




    }


    componentDidMount() {
        mylog("game didmount");
        this.resetAll();
        this.loadGame(); // if exists

        mylog(HelperConst.purchaseOptsSpecial);
        mylog(Space.spaceZoomLevels.map(n => HelperConst.showInt(n)));
        this.setState((state, props) => ({
            isLoaded: true,
        }));

        Modal.setAppElement('#root');

        mylog("init work done");
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

    setTitle() {
        document.title = "NEUMANN $"
            + HelperConst.showNum(this.userSettings.money)
            + " " + this.state.version;
    }

    populateInitVals() {
        // update our userSettings for all businesses and upgrades
        mylog("updating userSettings with bus and upg");
        this.state.businesses.forEach(item => {
            if (!this.userSettings.busStats[item.id])
                this.userSettings.busStats[item.id] = { owned: 0, revealed: false, timeAdj: -1, payoutAdj: 1, };
            this.domRefs.push({ name: item.name, domRef: React.createRef() });
        });
        this.state.upgrades.forEach(item => {
            if (!this.userSettings.upgStats[item.id])
                this.userSettings.upgStats[item.id] = { purchased: false, revealed: false };
        });
        this.probeDivRef = React.createRef();

        this.pulseRef = null;
        this.centerEllipseRef = null;
        this.innerEllipseRef = null;
        this.outerEllipseRef = null;
        this.centerPlanetRef = null;
        mylog("populated domRefs:", this.domRefs);
    }

    stopSaveGameInterval() {
        if (this.gameSaveIntervalId) {
            clearInterval(this.gameSaveIntervalId);
            delete (this.gameSaveIntervalId)
        }
    }
    startSaveGameInterval() {
        if (!this.gameSaveIntervalId) {
            this.gameSaveIntervalId = setInterval(this.saveGame, 30000);
            mylog("game intervalId set");
        }
        mylog("save intervalId:", this.gameIntervalId);
    }

    resetAll() {
        this.pause();
        this.setState((state, props) => ({
            ...NeumannInit.freshState()
        }));
        this.userSettings = { ...NeumannInit.userSettings() };
        this.announceCt = 0;
        this.modalCt = 0;
        this.populateInitVals();
        this.outerEllipseMoving = false;
        this.pulseMoving = false;
        this.zoomLevel = 0;
        this.zoomName = Space.spaceZoomLevelNames[0];
        this.mapDistance = Space.spaceZoomLevels[0];
        this.resume();
    }

    restart() {
        this.pause();
        this.setState((state, props) => ({
            ...NeumannInit.freshState()
        }));
        this.userSettings = { ...NeumannInit.userSettings() };
        this.populateInitVals();
        this.zoomLevel = 0;
        this.zoomName = Space.spaceZoomLevelNames[0];
        this.mapDistance = Space.spaceZoomLevels[0];
        this.resume();
    }

    pause() {
        this.timerRunning = false;
        this.setState((state) => ({
            pauseClass: "sidebarButtons fancyButtons  pause-button lit",
        }));
        if (this.gameIntervalId) {
            clearInterval(this.gameIntervalId);
            delete (this.gameIntervalId);
        }
        if (this.prestigeIntervalId) {
            clearInterval(this.prestigeIntervalId);
            delete (this.prestigeIntervalId)
        }
        this.stopSaveGameInterval();
        mylog("set timeRunning to", this.timerRunning);
    }


    resume() {
        this.timerRunning = true;
        this.setState((state) => ({
            pauseClass: "sidebarButtons fancyButtons  pause-button ",
        }));
        if (!this.gameIntervalId) {
            this.gameIntervalId = setInterval(this.updateGame, this.timeInterval);
        }
        if (!this.prestigeIntervalId) {
            this.prestigeIntervalId = setInterval(this.updatePrestigeEarned, 1000);
        }
        this.startSaveGameInterval();
        this.lastLoop = Date.now();
        mylog("set timeRunning to", this.timerRunning);
    }

    loadGame() {
        this.stopSaveGameInterval();
        const ls = new SecureLS({ encodingType: 'aes' });
        const saveString = ls.get('neumann_game_save');
        if (!saveString) {
            mylog("no save present");
            this.startSaveGameInterval();
            return;
        }
        mylog("loaded:", saveString);

        const decimalKeys = [
            "money",
            "knowledge",
            "value", "number", "qualityLoss", "combatLoss", "distance",
            "num",
            "prestigeNext",
            "lifetimeEarnings", "lifetimeLearning",
            "curMaxMoney"
        ];
        this.userSettings = JSON.parse(saveString, (key, value) => {
            if (decimalKeys.includes(key)) {
                mylog("  new decimal value for", key);
                return new Decimal(value);
            }
            return value;
        });
        // mylog("userSettings type:",typeof(this.userSettings));
        // mylog("userSettings:", this.userSettings);
        // mylog("probe:", this.userSettings.probe);

        const tempProbe = { ...this.userSettings.probe };
        this.userSettings.probe = new Probe(
            this.userSettings.probe.value,
            this.userSettings.probe.speed,
            this.userSettings.probe.quality,
            this.userSettings.probe.combat,
        );
        // mylog("userSettings:", this.userSettings);

        // mylog("saveString probe:",tempProbe);
        this.userSettings.probe.number = tempProbe.number;
        this.userSettings.probe.qualityLoss = tempProbe.qualityLoss;
        this.userSettings.probe.combatLoss = tempProbe.combatLoss;
        this.userSettings.probe.distance = tempProbe.distance;
        mylog("userSettings:", this.userSettings);

        this.populateInitVals();

        mylog("userSettings:", this.userSettings);

        const saveTime = ls.get('neumann_game_save_time');
        if (saveTime) {
            const deltaMillis = (Date.now() - saveTime);
            const duration = ComputeFunc.convertMillis(deltaMillis);
            mylog("you were gone for",
                duration.days + "d",
                duration.hours + "h",
                duration.minutes + "m",
                duration.seconds + "s",
            );

            const gained = Business.computeTotalEarningPerSec(this.state.businesses, this.userSettings, this.state.concentrate)
                .times(Math.floor(deltaMillis / 1000));
            mylog("previous money:", HelperConst.showNum(this.userSettings.money));
            mylog("you gained $", HelperConst.showNum(gained));
            this.userSettings.money = this.userSettings.money.plus(gained);
            mylog("now should have $", HelperConst.showNum(this.userSettings.money));
            mylog("probe distance:", HelperConst.showNum(this.userSettings.probe.distance));
        }

        // this.lastLoop = Date.now();
        this.startSaveGameInterval();
        this.announce("game loaded");
    }

    saveGame() {
        // this.stopSaveGameInterval();
        // mylog("userSettings:", this.userSettings);
        const ls = new SecureLS({ encodingType: 'aes' });
        const saveStringText = JSON.stringify(this.userSettings);
        // mylog("saveStringText:", saveStringText);

        ls.set('neumann_game_save_time', Date.now());
        ls.set('neumann_game_save', saveStringText);

        // this.announce("game saved");
        this.gameSavedObj = {
            content: this.gameSavedNotify,
            countdown: this.gameSavedCountdown,
        };
        // this.startSaveGameInterval();
        mylog("game saved");
    }

    decrementSavedGameObj() {
        if (this.gameSavedObj.countdown > 0) {
            this.gameSavedObj.countdown -= this.timeMultiplier;
        }
        if (this.gameSavedObj.countdown < 0) {
            this.gameSavedObj.content = this.gameSavedHide;
        }
    }

    updateConcentrate() {
        let concButtonClass = this.state.concentrateClass;
        if (this.state.concentrate > 0) {
            mylog("concentrate countdown:", this.state.concentrate);
            concButtonClass = "concActive";
            let newVal = this.state.concentrate - this.timeMultiplier;
            if (newVal <= 0) {
                newVal = -10;
                concButtonClass = "concCooldown";
            }
            this.setState((state, props) => ({
                concentrate: newVal,
                concentrateClass: concButtonClass,
            }))
        }
        if (this.state.concentrateClass === "concCooldown" && this.state.concentrate < 0) {
            mylog("concentrate cooldown:", this.state.concentrate);
            let newVal = this.state.concentrate + this.timeMultiplier;
            if (newVal >= 0) {
                newVal = 0;
                concButtonClass = "concIdle";
            }
            this.setState((state, props) => ({
                concentrate: newVal,
                concentrateClass: concButtonClass,
            }))
        }

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
    moneyCheat() {
        mylog("CHEAT: adding 50% money");
        this.userSettings.money = this.userSettings.money.times(1.5);
    }


    incrementBusinessCounters() {
        let changed = false;
        const newBusinesses = this.state.businesses.map(item => {
            let b = this.userSettings.busStats[item.id];
            // reset if new
            if (b.timeAdj === -1) b.timeAdj = item.timeBase;

            // concentrate
            const addVal = this.state.concentrate > 0 ? 2 * this.timeMultiplier : this.timeMultiplier;

            let newItem = { ...item };
            if (b.owned === 0) {
                if (b.revealed && item.timeCounter !== 0) {
                    newItem.timeCounter = 0;
                    changed = true;
                    mylog("resetting ", item.name, " to timeCounter ", newItem.timeCounter);
                }
            } else {
                newItem.payout = 0;
                newItem.timeCounter = newItem.timeCounter + addVal;
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

        const conv = Space.convertDistanceToSpace(this.userSettings.probe.distance);
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
                this.announce(HelperConst.thumbsUpSymbol+" All businesses at " + num + "! Speed Doubled!");
            })

        }


    }

    enableFeature(feature) {
        mylog("feature click ", feature.name);
        this.userSettings.upgStats[feature.id].purchased = true;
        this.userSettings.featureEnabled[feature.id] = true;
        mylog("feature enabled:", feature.rewardTarget);

        switch (feature.id) {
            case 1000:
                this.announce(HelperConst.thumbsUpSymbol+" SPAAAAACE!  The Final* Frontier!");
                break;
            case 1003:  // probe quality
                this.sliderInfo.rangeSettings = Sliders.getRangeValues(2);
                this.sliderInfo.probePcts = this.reportRangePcts();
                break;
            case 1004:  // probe combat
                this.sliderInfo.rangeSettings = Sliders.getRangeValues(3);
                this.sliderInfo.probePcts = this.reportRangePcts();
                break;
            default:
                break;
        }

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
                this.addOverlay(upg.rewardTarget, "x" + upg.rewardValue, "ownedBonus");
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

    clickConcentrate() {
        mylog("clickConcentrate");
        if (this.state.concentrate <= 0) {
            this.setState((state, props) => ({
                concentrate: 10,
            }));
        }
        mylog("concentrate:", this.state.concentrate);
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

    addOverlay(busIdx, text, ovType = "generic") {
        const bus = this.state.businesses[busIdx];
        mylog("addOverlay click ", text, bus.name);
        this.setState((state, props) => ({
            businesses: update(state.businesses, {
                [busIdx]: {
                    overlays: {
                        $set: this.genOverlayArr(bus.overlays, text, ovType),
                    }
                },
            }),
        }));
    }

    changeTabs(idx) {
        this.tabIndex = idx;
    }

    sliderChange(value) {
        // mylog("slider change:", value);
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
        let pSpeedPct = 0, pQualityPct = 0, pCombatPct = 0;
        mylog("spd:", pSpeedPct, "qual:", pQualityPct, "comb:", pCombatPct);
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
        this.decrementSavedGameObj();
        this.updateConcentrate();

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

        // if space view activated
        if (this.userSettings.featureEnabled[1000])
            rows.push(<Tab className="tab-list-item" key="probe-tab">Space</Tab>);

        rows.push(<Tab className="tab-list-item spacer-tab" key="spacer-tab"></Tab>);

        if (this.userSettings.prestige.num.gt(0) || this.userSettings.prestigeNext.gt(0))
            rows.push(<Tab className="tab-list-item prestige-tab" key="prestige-tab">Prestige</Tab>);

        rows.push(<Tab className="tab-list-item settings-tab" key="settings-tab">Settings</Tab>);

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
        let currentProbe = "";
        let sliderText = "Spend " + this.sliderInfo.probeSpendPct + "%";

        // probes enabled
        if (this.userSettings.featureEnabled[1001]) {
            offlinetext = "";
            currentProbe = <div id="previousProbe">Current Probe: {HelperConst.moneySymbolSpan()}{HelperConst.showNum(this.userSettings.probe.value)}</div>
            probebutton = (
                <button className="probe-purchase"
                    onClick={this.purchaseProbe}>
                    Buy Probe: {HelperConst.moneySymbolSpan()}{HelperConst.showNum(ComputeFunc.getPct(this.userSettings.money, this.sliderInfo.probeSpendPct))}
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
            } else {  // rangeCt === 3
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


        // space view
        if (this.userSettings.featureEnabled[1000]) {
            return (
                <TabPanel className="react-tabs__tab-panel probe-tab-panel">

                    <div id="right-sidebar">
                        {offlinetext}
                        {sliderattribs}
                        {probeattribs}
                        {probebutton}
                        {currentProbe}
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

    toggleOverlay(event) {
        mylog("event:", event);
        mylog("toggleOverlay target is:", event.target.checked);
        this.userSettings.toggles.overlays = event.target.checked;
    }
    getSettingsTab() {
        return (
            <TabPanel className="react-tabs__tab-panel settings-tab-panel">
                <div id="right-sidebar">
                    SETTINGS
                </div>

                <Settings
                    toggles={this.userSettings.toggles}
                    toggleOverlay={this.toggleOverlay}
                />

            </TabPanel>
        )
    }


    getPrestigeTab() {
        if (this.userSettings.prestige.num.gt(0) || this.userSettings.prestigeNext.gt(0))
            return (
                <TabPanel className="react-tabs__tab-panel prestige-tab-panel">
                    <div id="right-sidebar">
                        PRESTIGE
                </div>

                    <Prestige>

                    </Prestige>
                </TabPanel>
            )
    }

    openHelpModal() {
        // this.pause();
        this.setState((state, props) => ({ helpModalIsOpen: true }));
    }
    closeHelpModal() {
        mylog("close Help modal");
        // this.resume();
        this.setState((state, props) => ({ helpModalIsOpen: false }));
    }
    afterOpenHelpModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }


    render() {
        const { isLoaded } = this.state;
        if (!isLoaded) return <div id="wrapper"></div>

        let debugButtons;
        if (HelperConst.DEBUG) {
            debugButtons =
                <div className="debugButtons">
                    <button className={this.state.pauseClass} onClick={this.pause}>Pause</button>
                    <button className={"sidebarButtons fancyButtons  pause-button "} onClick={this.resume}>Resume</button>
                    <button className="sidebarButtons fancyButtons  reset-button" onClick={this.resetAll}>RESET</button>
                    <button
                        className="sidebarButtons fancyButtons  prestige-button"
                        disabled={this.userSettings.prestigeNext.gt(0) ? false : true}
                        onClick={this.prestige}>Prestige</button>
                    <button className="sidebarButtons fancyButtons  test-give-prestige"
                        onClick={this.prestigeCheat}>+{this.cheatPrestigeVal} prestige</button>
                    <button className="sidebarButtons fancyButtons  test-give-money"
                        onClick={this.moneyCheat}>+50% money</button>
                    <button className="sidebarButtons fancyButtons  announce-button" onClick={() => this.announce(HelperConst.thumbsUpSymbol+" great job winning!  oh boy this is just super.")}>Announce</button>
                    <button className="sidebarButtons fancyButtons  overlay-button" onClick={() => this.addOverlay(0, "X2")}>Mental Math Overlay</button>
                    {/* <button className="sidebarButtons fancyButtons  overlay-button" onClick={() => this.addOverlay(1, "X2")}>Newspaper Overlay</button> */}
                    {/* <button className="sidebarButtons fancyButtons  ref-button" onClick={() => mylog("domRef:", this.state.businesses[0].domRef)}>Odd Job domRef</button> */}
                    {/* <button className="sidebarButtons fancyButtons  ref-button" onClick={() => mylog("domRef2:", this.state.businesses[1].domRef)}>Newspaper domRef</button> */}
                    {/* <button className="sidebarButtons fancyButtons  ref-button" onClick={() => mylog("getRect:", Business.getPosition(this.state.businesses[0].domRef))}>getRect</button>  */}

                    <button className="sidebarButtons fancyButtons  save-button" onClick={this.saveGame}>SAVE</button>
                    <button className="sidebarButtons fancyButtons  save-button" onClick={this.loadGame}>LOAD</button>
                    {/* <h3>Zoom Index: {this.zoomLevel}</h3><br /> */}
                    {/* <h3>RangeCt: {this.sliderInfo.rangeSettings.rangeCt}</h3> */}

                    <button onClick={this.openHelpModal}>Open Modal</button>



                </div>
        }


        return (
            <div id="wrapper">
                <div id="header">

                    <Income
                        knowledge={this.userSettings.knowledge}
                        businesses={this.state.businesses}
                        concentrate={this.state.concentrate}
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

                                <div className="buy-wrapper">
                                    <span className="buyx-prefix">Buy {HelperConst.multiplySymbol}</span>
                                    <Dropdown
                                        options={HelperConst.purchaseOpts}
                                        onChange={this.purchaseAmtDropDownHandler}
                                        value={this.purchaseAmt}
                                        placeholder="Select an option" />
                                </div>
                            </div>

                            <div id="concentrate-container">
                                <button
                                    id="concentrateButton"
                                    className={this.state.concentrateClass}
                                    onClick={this.clickConcentrate}
                                    disabled={this.state.concentrate === 0 ? false : true}
                                >{this.state.concentrateClass === "concCooldown"
                                    ? "Wait: " + Math.abs(Math.floor(this.state.concentrate))
                                    : this.state.concentrateClass === "concActive"
                                        ? HelperConst.concentrateSymbol+" : " + Math.abs(Math.floor(this.state.concentrate))
                                        : "Concentrate 3x Speed"}
                                </button>
                            </div>

                            {debugButtons}

                        </div>

                        <div id="content">
                            <div className="container">

                                <Business
                                    businesses={this.state.businesses}
                                    concentrate={this.state.concentrate}
                                    userSettings={this.userSettings}
                                    purchaseAmt={this.purchaseAmt}
                                    onClick={this.clickBusiness}
                                    domRefs={this.domRefs}
                                />


                            </div>

                        </div>

                    </TabPanel>

                    {this.getProbeTab()}

                    <TabPanel className="react-tabs__tab-panel spacer-tab-panel"></TabPanel>

                    {this.getPrestigeTab()}
                    {this.getSettingsTab()}

                </Tabs>

                <div id="footer">

                    <div id="version">v. 0.0.1</div>
                    <div id="fps">fps:{this.fpsPct}%</div>
                    {this.gameSavedObj.content}

                </div>

                <div id="announcements">
                    <Announce
                        announcements={this.state.announcements}
                        onClick={this.clickAnnouncement}
                    />
                </div>

                <Modal
                    isOpen={this.state.helpModalIsOpen}
                    // onAfterOpen={this.afterOpenHelpModal}
                    onRequestClose={this.closeHelpModal}
                    contentLabel="Example Modal"
                    shouldCloseOnOverlayClick={false}
                    className="Modal"
                    overlayClassName="Modal-Overlay"
                >
                    {/* <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2> */}
                    <div className="modal-container">
                        <div className="modalHeader">
                            <div className="modalTitle">Help</div>
                            <button
                                className="modalButtons fancyButtons helpModalCloseButton"
                                onClick={this.closeHelpModal}>
                                CLOSE
                            </button>
                        </div>
                        <div className="modalContent">
                            {HelperConst.modalHelp()}

                        </div>
                    </div>
                </Modal>

            </div>

        )
    }




}

// =====================================================


