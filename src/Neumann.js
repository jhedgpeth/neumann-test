import React from 'react';
// import ReactDOM from 'react-dom'
import SecureLS from 'secure-ls';
import update from 'immutability-helper';
import Modal from 'react-modal';
import Dropdown from 'react-dropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import UIfx from 'uifx';

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
import Logs from './Logs';
import Prestige from './Prestige';
import ToolTip from './ToolTip';
import MyModal from './MyModal';
import Sounds from './Sounds';

const Decimal = require('decimal.js');
const mylog = HelperConst.DebugLog;

// =====================================================
export default class Neumann extends React.Component {

    constructor(props) {
        super(props);

        this.state = { ...NeumannInit.freshState() };
        this.state.helpModalIsOpen = false;
        this.modalTexts = [];
        this.modalTitle = "";
        this.modalText = "";

        this.userSettings = { ...NeumannInit.userSettings() };

        this.timerRunning = false;
        this.state.pauseClass = "sidebarButtons fancyButtons pause-button ";
        this.timeInterval = 100;
        this.timeMultiplier = this.timeInterval / 1000;
        this.lastLoop = Date.now();


        this.gameSavedHide = <div id="savegame"></div>;
        this.gameSavedNotify = <div id="savegame" className="game-saved">Game Saved</div>
        this.gameSavedNotifyAlt = <div id="savegame" className="game-saved-alt">Game Saved</div>
        this.gameSavedCountdown = 4;


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

        // this.userSettings.sliderInfo = {
        //     rangeSettings: Sliders.getRangeValues(1),
        //     probePcts: [50, 50, 0],
        //     probeSpendPct: 25,
        // }

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
        this.showModal = this.showModal.bind(this);
        this.nextModal = this.nextModal.bind(this);
        this.sliderChange = this.sliderChange.bind(this);
        this.rangeChange = this.rangeChange.bind(this);
        this.enableFeature = this.enableFeature.bind(this);
        this.purchaseProbe = this.purchaseProbe.bind(this);
        this.getSettingsTab = this.getSettingsTab.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
        this.toggleSound = this.toggleSound.bind(this);
        this.clickConcentrate = this.clickConcentrate.bind(this);
        this.decrementConcentrate = this.updateConcentrate.bind(this);

        this.onMouseOver = this.onMouseOver.bind(this);
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

    playSound(snd) {
        if (this.userSettings.toggles.sound) {
            Sounds.playSound(snd);
        }
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
        mylog("loadGame");
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
            "value", "number", "qualityLoss", "combatLoss", "distance", "distPerSec",
            "num",
            "prestigeNext",
            "lifetimeEarnings", "lifetimeLearning", "lifetimeDistance",
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
        mylog("building probe from save.  finished:", this.userSettings.probe.finished);
        this.userSettings.probe = new Probe(
            this.userSettings.probe.number,
            this.userSettings.probe.value,
            this.userSettings.probe.speed,
            this.userSettings.probe.quality,
            this.userSettings.probe.combat,
            this.userSettings.probe.finished,
        );
        console.table(this.userSettings.probe);
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
        if (saveTime && (Date.now() - saveTime) > 30000) {
            const deltaMillis = (Date.now() - saveTime);
            const duration = ComputeFunc.convertMillis(deltaMillis);
            mylog("you were gone for",
                duration.days + "d",
                duration.hours + "h",
                duration.minutes + "m",
                duration.seconds + "s",
            );

            const moneyGained = Business.computeTotalEarningPerSec(this.state.businesses, this.userSettings, this.state.concentrate)
                .times(Math.floor(deltaMillis / 1000));
            mylog("previous money:", HelperConst.showNum(this.userSettings.money));
            mylog("you gained $", HelperConst.showNum(moneyGained));
            this.userSettings.money = this.userSettings.money.plus(moneyGained);
            mylog("now should have $", HelperConst.showNum(this.userSettings.money));

            let probeDistGained = Decimal(0);
            if (!this.userSettings.probe.finished) {
                mylog("probe distance:", HelperConst.showNum(this.userSettings.probe.distance));
                probeDistGained = this.userSettings.probe.getDistPerSec().times(Math.floor(deltaMillis / 1000));
                mylog("probe dist gained:", HelperConst.showNum(probeDistGained));
                this.userSettings.probe.goFarther(probeDistGained);
            } else {
                mylog("probe is finished");
            }

            this.showModal("Welcome Back!", HelperConst.welcomeBack(duration, moneyGained, probeDistGained));
        }

        // this.lastLoop = Date.now();
        this.startSaveGameInterval();
        this.announce("game loaded");
    }

    saveGame() {
        mylog("saveGame");
        console.table(this.userSettings.probe);

        // this.stopSaveGameInterval();
        // mylog("userSettings:", this.userSettings);
        const ls = new SecureLS({ encodingType: 'aes' });
        const saveStringText = JSON.stringify(this.userSettings);
        // mylog("saveStringText:", saveStringText);

        ls.set('neumann_game_save_time', Date.now());
        ls.set('neumann_game_save', saveStringText);

        let saveClass = this.gameSavedNotify;
        if (this.state.gameSavedObj.content === this.gameSavedNotify) {
            saveClass = this.gameSavedNotifyAlt;
        }

        // this.announce("game saved");
        this.setState((state, props) => ({
            gameSavedObj: {
                content: saveClass,
                countdown: this.gameSavedCountdown,
            }
        }));
        // this.startSaveGameInterval();
        mylog("game saved");
    }

    decrementSavedGameObj() {
        if (this.state.gameSavedObj.countdown > 0) {
            this.setState((state, props) => ({
                gameSavedObj: {
                    content: state.gameSavedObj.content,
                    countdown: state.gameSavedObj.countdown - this.timeMultiplier,
                }
            }));
        }
        if (this.state.gameSavedObj.countdown < 0) {
            this.setState((state, props) => ({
                gameSavedObj: {
                    content: this.gameSavedHide,
                    countdown: 0,
                }
            }));
        }
    }

    updateConcentrate() {
        let concButtonClass = this.state.concentrateClass;

        if (this.state.concentrate.time > 0) {
            // mylog("concentrate countdown:", this.state.concentrate);
            concButtonClass = "concActive";
            let newVal = this.state.concentrate.time - this.timeMultiplier;
            if (newVal <= 0) {
                newVal = -10;
                concButtonClass = "concCooldown";
                this.playSound("unconcentrate");
            }
            this.setState((state, props) => ({
                concentrate: { time: newVal, mult: this.userSettings.concentrate.mult },
                concentrateClass: concButtonClass,
            }))
        }

        if (this.state.concentrateClass === "concCooldown" && this.state.concentrate.time < 0) {
            // mylog("concentrate cooldown:", this.state.concentrate);
            // mylog("concentrate type:", typeof (this.state.concentrate));
            let newVal = this.state.concentrate.time + this.timeMultiplier;
            if (newVal >= 0) {
                newVal = 0;
                concButtonClass = "concIdle";
            }
            this.setState((state, props) => ({
                concentrate: { time: newVal, mult: this.userSettings.concentrate.mult },
                concentrateClass: concButtonClass,
            }))
        }

    }

    updatePrestigeEarned() {
        const newPrestigeNext = ComputeFunc.calcPrestigeEarnedFromLearning(this.userSettings.knowledge)
            .minus(this.userSettings.prestigeNext);
        if (newPrestigeNext.gt(0) && !newPrestigeNext.eq(this.userSettings.prestigeNext)) {
            mylog("newPrestigeNext:", newPrestigeNext.toFixed(9), "prestigeNext:", this.userSettings.prestigeNext.toFixed(9));
            this.userSettings.prestigeNext = this.userSettings.prestigeNext.plus(newPrestigeNext);
        }
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
        mylog("CHEAT: adding 100% money");
        this.userSettings.money = this.userSettings.money.times(2);
    }


    incrementBusinessCounters() {
        let changed = false;
        const newBusinesses = this.state.businesses.map(item => {
            let b = this.userSettings.busStats[item.id];
            // reset if new
            if (b.timeAdj === -1) b.timeAdj = item.timeBase;

            // concentrate
            const addVal = this.state.concentrate.time > 0 ? this.userSettings.concentrate.mult * this.timeMultiplier : this.timeMultiplier;

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
            this.setState((state, props) => ({
                businesses: newBusinesses,
            }))
        }
    }

    updateProbe() {


        if (!this.userSettings.probe.finished) {

            if (this.userSettings.probe.qualityLoss.gt(0) && !this.userSettings.probeQualityShown)
                this.userSettings.probeQualityShown = true;
            if (this.userSettings.probe.combatLoss.gt(0) && !this.userSettings.probeCombatShown)
                this.userSettings.probeCombatShown = true;

            if (!this.userSettings.probe.finished && this.userSettings.probe.getLiveNumber().lt(1)) {
                this.announce("All probes lost!");
                this.playSound("probefail");
                this.userSettings.probe.finished = true;
            }

            // knowledge increase
            const oldDist = this.userSettings.probe.distance;
            const addDist = this.userSettings.probe.getDistPerTick(this.timeMultiplier);
            this.userSettings.lifetimeDistance = this.userSettings.lifetimeDistance.plus(addDist);
            this.userSettings.probe.goFarther(addDist);

            const newLearning = this.userSettings.probe.getLearned(this.userSettings.probe.distance)
                .minus(this.userSettings.probe.getLearned(oldDist));
            if (newLearning.gt(0)) {
                this.userSettings.knowledge = this.userSettings.knowledge.plus(newLearning);
            }

            // probe replication
            this.userSettings.probe.updateNumber();

            const conv = Space.convertDistanceToSpace(this.userSettings.probe.distance);
            this.mapDistance = conv.dist;
            this.zoomLevel = conv.idx;
            this.zoomName = conv.name;
            // mylog("conv:",conv);
        }
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
        this.playSound("busbuy");
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

                if (busMult > 1) {
                    this.playSound("busmult");
                    if (this.userSettings.toggles.overlays) {
                        bonusArr.push(this.genOverlayObj("X" + busMult, "ownedBonus"));
                    }
                }
                if (this.userSettings.toggles.overlays) {
                    newItem.overlays = this.genOverlayArr(item.overlays, "+" + busCost.num).concat(bonusArr);
                }
                mylog("adding", busCost.num, "to", newItem.name);
            }
            return newItem;
        });

        if (this.userSettings.toggles.overlays) {
            /* for overlays */
            this.setState((state, props) => ({
                businesses: newBusinesses,
            }));
        }


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
                this.announce(HelperConst.thumbsUpSymbol + " All businesses at " + num + "! Speed Doubled!");
            })

        }


    }

    enableFeature(feature) {
        mylog("feature click ", feature.name);
        this.playSound("powerup");
        this.userSettings.upgStats[feature.id].purchased = true;
        this.userSettings.featureEnabled[feature.id] = true;
        mylog("feature enabled:", feature.rewardTarget);

        switch (feature.id) {
            case 5000:
                this.announce(HelperConst.thumbsUpSymbol + " SPAAAAACE!  It's bigger on the outside.");
                break;
            case 5001:  // self-replicating (probes)
                this.announce(HelperConst.thumbsUpSymbol + " When a boy robot likes a girl robot...  In space.");
                break;
            case 5002:  // nano technology
                this.announce(HelperConst.thumbsUpSymbol + " It feels like I'm building nothing at all!");
                break;
            case 5003:  // probe quality
                this.userSettings.sliderInfo.rangeSettings = Sliders.getRangeValues(2);
                this.userSettings.sliderInfo.probePcts = this.reportRangePcts();
                this.announce(HelperConst.thumbsUpSymbol + " Hey, Stanisław!  What if we measured things first?");
                break;
            case 5004:  // probe combat
                this.userSettings.sliderInfo.rangeSettings = Sliders.getRangeValues(3);
                this.userSettings.sliderInfo.probePcts = this.reportRangePcts();
                this.announce(HelperConst.thumbsUpSymbol + " H-BOMB!  The H is for Hello.");
                break;
            case 10000:  // probe autobuy
                this.announce(HelperConst.thumbsUpSymbol + " If you put the little drinky-bird over the button like so...");
                break;
            default:
                break;
        }

    }

    clickUpgrade(upg) {
        mylog("upgrade click ", upg.name);
        this.playSound("powerup");
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

    showModal(title, text) {
        console.log("adding modal:", text);
        this.modalTexts.push({ title: title, text: text });
    }

    clickConcentrate() {
        mylog("clickConcentrate");
        this.playSound("concentrate");
        if (this.state.concentrate.time <= 0) {
            this.setState((state, props) => ({
                concentrate: { time: 10, mult: this.userSettings.concentrate.mult }
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
        if (!this.userSettings.toggles.overlays) return;
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
        if (idx !== this.tabIndex) {
            this.playSound("tabswitch");
            this.tabIndex = idx;
        }
    }

    sliderChange(value) {
        // mylog("slider change:", value);
        this.userSettings.sliderInfo.probeSpendPct = value;
    }
    rangeChange(value) {
        // mylog("range change:", value);
        if (this.userSettings.sliderInfo.rangeSettings.rangeCt === 2) {
            this.userSettings.sliderInfo.rangeSettings.distribRange = [0, value[1], 100];
        } else if (this.userSettings.sliderInfo.rangeSettings.rangeCt === 3) {
            this.userSettings.sliderInfo.rangeSettings.distribRange = [0, value[1], value[2], 100];
        }
        this.userSettings.sliderInfo.probePcts = this.reportRangePcts();
        // mylog("fixed range:", this.distribRange);
    }
    reportRangePcts() {
        let pSpeedPct = 0, pQualityPct = 0, pCombatPct = 0;
        if (this.userSettings.sliderInfo.rangeSettings.rangeCt === 1) {
            pSpeedPct = 100;
        } else if (this.userSettings.sliderInfo.rangeSettings.rangeCt === 2) {
            pSpeedPct = Math.floor(this.userSettings.sliderInfo.rangeSettings.distribRange[1]);
            pQualityPct = 100 - pSpeedPct;

        } else if (this.userSettings.sliderInfo.rangeSettings.rangeCt === 3) {
            pSpeedPct = Math.floor(this.userSettings.sliderInfo.rangeSettings.distribRange[1]);
            pQualityPct = Math.floor(this.userSettings.sliderInfo.rangeSettings.distribRange[2] - pSpeedPct);
            pCombatPct = 100 - (pSpeedPct + pQualityPct);
        }
        return [pSpeedPct, pQualityPct, pCombatPct];
    }

    purchaseProbe() {
        const pCost = ComputeFunc.getPct(this.userSettings.money, this.userSettings.sliderInfo.probeSpendPct);
        const pcts = this.reportRangePcts();
        mylog("probe cost:", pCost.toNumber());
        mylog("probe attrs - pSpeed:", pcts[0], "pQuality:", pcts[1], "pCombat:", pcts[2]);
        this.userSettings.probe = new Probe(new Decimal(1), pCost, pcts[0], pcts[1], pcts[2], false);
        this.playSound("probelaunch");
    }



    getTabList() {
        let rows = [];
        // 1 - Business
        rows.push(<Tab className="tab-list-item" key="business-tab" >Business</Tab>);

        // 2 - Space
        if (this.userSettings.featureEnabled[5000])
            rows.push(<Tab className="tab-list-item" key="probe-tab">Space</Tab>);

        // 3 - Spacer
        rows.push(<Tab className="tab-list-item spacer-tab" key="spacer-tab" />);

        // 4 - Prestige
        if (this.userSettings.prestige.num.gt(0) || this.userSettings.prestigeNext.gt(0))
            rows.push(<Tab className="tab-list-item prestige-tab" key="prestige-tab">Prestige</Tab>);

        // 5 - Logs
        rows.push(<Tab className="tab-list-item log-tab" key="log-tab">Log</Tab>);

        // 6 - Settings
        rows.push(<Tab className="tab-list-item settings-tab" key="settings-tab">Settings</Tab>);

        return (
            <div id="tabs">
                <TabList className="tab-list">
                    {rows}
                </TabList>
            </div>
        )
    }

    getSpaceTab() {
        let probebutton, probeattribs, sliderattribs, offlinetext;
        let currentProbe = "";
        let newText = this.userSettings.probe.finished ? "Buy" : "REPLACE";
        let currentText = this.userSettings.probe.finished ? "Previous" : "Current";
        let sliderText = "Spend " + this.userSettings.sliderInfo.probeSpendPct + "%";

        // probes enabled
        if (this.userSettings.featureEnabled[5001]) {
            offlinetext = "";
            currentProbe = <div id="previousProbe" onMouseOver={this.onMouseOver} data-tip="previousProbe">{currentText} Probe: {HelperConst.moneySymbolSpan()}{HelperConst.showNum(this.userSettings.probe.value)}</div>
            probebutton = (
                <button className={"probe-" + newText.toLowerCase()}
                    onClick={this.purchaseProbe}
                    onMouseOver={this.onMouseOver} data-tip={"probe-" + newText.toLowerCase()}>
                    {newText} Probe: {HelperConst.moneySymbolSpan()}{HelperConst.showNum(ComputeFunc.getPct(this.userSettings.money, this.userSettings.sliderInfo.probeSpendPct))}
                </button>
            );
            if (this.userSettings.sliderInfo.rangeSettings.rangeCt === 1) {
                probeattribs = <div className="probe-attribs"></div>
                sliderattribs =
                    <div className="sliderattribs" onMouseOver={this.onMouseOver} data-tip="sliderattribs">
                        <span className="probe-prod-span">Probe Production</span>
                        <div className="sliderHeader">{sliderText}</div>
                        <div className="sliderContainer">
                            {Sliders.getSlider(this.userSettings.sliderInfo, this.sliderChange)}
                        </div>
                    </div>
            } else if (this.userSettings.sliderInfo.rangeSettings.rangeCt === 2) {

                sliderattribs =
                    <div className="sliderattribs" onMouseOver={this.onMouseOver} data-tip="sliderattribs">
                        <span className="probe-prod-span">Probe Production</span>
                        <div className="sliderHeader">{sliderText}</div>
                        <div className="sliderContainer">
                            {Sliders.getSlider(this.userSettings.sliderInfo, this.sliderChange)}
                        </div>
                        <div className="sliderHeader">Distribute Funds</div>
                        <div className="sliderContainer">
                            {Sliders.getRange(this.userSettings.sliderInfo, this.rangeChange)}
                        </div>
                    </div>
                probeattribs =
                    <div className="probe-attribs" onMouseOver={this.onMouseOver} data-tip="probe-attribs">
                        <div className="probe-attrib speed-header" onMouseOver={this.onMouseOver} data-tip="probe-attribs-speed">Speed</div>
                        <div className="probe-attrib quality-header" onMouseOver={this.onMouseOver} data-tip="probe-attribs-quality">Quality</div>
                        <div></div>
                        <div className="probe-attrib probe-speed" onMouseOver={this.onMouseOver} data-tip="probe-attribs-speed">{this.userSettings.sliderInfo.probePcts[0]}%</div>
                        <div className="probe-attrib probe-quality" onMouseOver={this.onMouseOver} data-tip="probe-attribs-quality">{this.userSettings.sliderInfo.probePcts[1]}%</div>
                        <div></div>
                    </div>
            } else {  // rangeCt === 3

                sliderattribs =
                    <div className="sliderattribs" onMouseOver={this.onMouseOver} data-tip="sliderattribs">
                        <span className="probe-prod-span">Probe Production</span>
                        <div className="sliderHeader">{sliderText}</div>
                        <div className="sliderContainer">
                            {Sliders.getSlider(this.userSettings.sliderInfo, this.sliderChange)}
                        </div>
                        <div className="sliderHeader">Distribute Funds</div>
                        <div className="sliderContainer">
                            {Sliders.getRange(this.userSettings.sliderInfo, this.rangeChange)}
                        </div>
                    </div>
                probeattribs =
                    <div className="probe-attribs" onMouseOver={this.onMouseOver} data-tip="probe-attribs">
                        <div className="probe-attrib speed-header" onMouseOver={this.onMouseOver} data-tip="probe-attribs-speed">Speed</div>
                        <div className="probe-attrib quality-header" onMouseOver={this.onMouseOver} data-tip="probe-attribs-quality">Quality</div>
                        <div className="probe-attrib combat-header" onMouseOver={this.onMouseOver} data-tip="probe-attribs-combat">Combat</div>
                        <div className="probe-attrib probe-speed" onMouseOver={this.onMouseOver} data-tip="probe-attribs-speed">{this.userSettings.sliderInfo.probePcts[0]}%</div>
                        <div className="probe-attrib probe-quality" onMouseOver={this.onMouseOver} data-tip="probe-attribs-quality">{this.userSettings.sliderInfo.probePcts[1]}%</div>
                        <div className="probe-attrib probe-combat" onMouseOver={this.onMouseOver} data-tip="probe-attribs-combat">{this.userSettings.sliderInfo.probePcts[2]}%</div>
                    </div>
            }
        } else {
            offlinetext = <div id="probe-offline" onMouseOver={this.onMouseOver} data-tip="probe-offline">[ OFFLINE ]</div>;
        }


        // space view
        if (this.userSettings.featureEnabled[5000]) {
            return (
                <TabPanel className="react-tabs__tab-panel probe-tab-panel">

                    <div id="right-sidebar" onMouseOver={this.onMouseOver} data-tip="right-sidebar">
                        {offlinetext}
                        {sliderattribs}
                        {probeattribs}
                        {probebutton}
                        {currentProbe}
                        <ToolTip
                            tipText={this.state.tipText}
                            userSettings={this.userSettings}
                            onMouseOver={this.onMouseOver}
                        />
                    </div>

                    <Space
                        probe={this.userSettings.probe}
                        timeMultiplier={this.timeMultiplier}
                        userSettings={this.userSettings}
                        onMouseOver={this.onMouseOver}
                    />

                </TabPanel>
            )
        } else {
            return (<div></div>);
        }
    }

    toggleOverlay(event) {
        // mylog("event:", event);
        // mylog("toggleOverlay target is:", event.target.checked);
        this.playSound("toggle");
        this.userSettings.toggles.overlays = event.target.checked;
    }

    toggleSound(event) {
        // mylog("event:", event);
        // mylog("toggleSound target is:", event.target.checked);
        this.userSettings.toggles.sound = event.target.checked;
        if (this.userSettings.toggles.sound) { this.playSound("toggle"); }
        // mylog("sound toggled:",this.userSettings.toggles.sound);

    }

    getSettingsTab() {
        return (
            <TabPanel className="react-tabs__tab-panel settings-tab-panel">
                <div id="right-sidebar" onMouseOver={this.onMouseOver} data-tip="right-sidebar">
                    SETTINGS

                    <ToolTip
                        tipText={this.state.tipText}
                        userSettings={this.userSettings}
                        onMouseOver={this.onMouseOver}
                    />
                </div>

                <Settings
                    toggles={this.userSettings.toggles}
                    toggleOverlay={this.toggleOverlay}
                    toggleSound={this.toggleSound}
                />

            </TabPanel>
        )
    }

    getLogTab() {
        return (
            <TabPanel className="react-tabs__tab-panel log-tab-panel">
                <div id="right-sidebar" onMouseOver={this.onMouseOver} data-tip="right-sidebar">
                    LOGS

                    <ToolTip
                        tipText={this.state.tipText}
                        userSettings={this.userSettings}
                        onMouseOver={this.onMouseOver}
                    />
                </div>

                <Logs

                />

            </TabPanel>
        )
    }

    getPrestigeTab() {
        if (this.userSettings.prestige.num.gt(0) || this.userSettings.prestigeNext.gt(0))
            return (
                <TabPanel className="react-tabs__tab-panel prestige-tab-panel">
                    <div id="right-sidebar" onMouseOver={this.onMouseOver} data-tip="right-sidebar">
                        PRESTIGE

                        <ToolTip
                            tipText={this.state.tipText}
                            userSettings={this.userSettings}
                            onMouseOver={this.onMouseOver}
                        />
                    </div>

                    <Prestige

                    />
                </TabPanel>
            )
    }

    onMouseOver(e) {
        if (e.target && e.target.dataset) {
            // mylog("target found");
            // mylog("e:",e);
            // mylog("related target:",e.relatedTarget);
            if (e.target.dataset.tip) {
                // mylog("target tip:", e.target.dataset.tip);
                let newText = String(e.target.dataset.tip);
                this.setState((state, props) => ({
                    tipText: newText,
                }));
            }
        } else if (e.target) {
            /* konva & space */
            // mylog("target:",e.target);
            // mylog("data-tip:",e.target.attrs['data-tip']);
            let newText = String(e.target.attrs['data-tip']);
            this.setState((state, props) => ({
                tipText: newText,
            }));

        } else if (e.relatedTarget && e.relatedTarget.dataset) {
            if (e.relatedTarget.dataset.tip) {
                mylog("related target tip:", e.relatedTarget.dataset.tip);
                let newText = String(e.relatedTarget.dataset.tip);
                this.setState((state, props) => ({
                    tipText: newText,
                }));
            }
        }
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
        // this.subtitle.style.color = '#f00';
    }
    nextModal() {
        const modalPop = this.modalTexts.shift();
        this.modalTitle = modalPop.title;
        this.modalText = modalPop.text;
        this.openHelpModal();
    }

    updateGame() {

        if (this.modalTexts.length > 0 && !this.state.helpModalIsOpen) {
            this.nextModal();
        }
        if (this.state.gameSavedObj.content === this.gameSavedNotifyAlt) {
            this.setState((state, props) => ({
                gameSavedObj: {
                    content: this.gameSavedNotify,
                    countdown: this.gameSavedCountdown,
                }
            }));
        }

        const now = Date.now();
        const dt = now - this.lastLoop;
        this.lastLoop = now;
        this.timeMultiplier = dt / 1000;
        this.fpsPct = Math.floor((100 / dt) * 100);
        // mylog("dt:",dt,"this.fpsPct:",this.fpsPct);

        this.incrementBusinessCounters();
        this.updateProbe();
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
                        onClick={this.moneyCheat}>+100% money</button>
                    <button className="sidebarButtons fancyButtons  announce-button" onClick={() => this.announce(HelperConst.thumbsUpSymbol + " great job winning!  oh boy this is just super.")}>Announce</button>
                    {/* <button className="sidebarButtons fancyButtons  overlay-button" onClick={() => this.addOverlay(0, "X2")}>Mental Math Overlay</button> */}
                    {/* <button className="sidebarButtons fancyButtons  overlay-button" onClick={() => this.addOverlay(1, "X2")}>Newspaper Overlay</button> */}
                    {/* <button className="sidebarButtons fancyButtons  ref-button" onClick={() => mylog("domRef:", this.state.businesses[0].domRef)}>Odd Job domRef</button> */}
                    {/* <button className="sidebarButtons fancyButtons  ref-button" onClick={() => mylog("domRef2:", this.state.businesses[1].domRef)}>Newspaper domRef</button> */}
                    {/* <button className="sidebarButtons fancyButtons  ref-button" onClick={() => mylog("getRect:", Business.getPosition(this.state.businesses[0].domRef))}>getRect</button>  */}

                    <button className="sidebarButtons fancyButtons  save-button" onClick={this.saveGame}>SAVE</button>
                    <button className="sidebarButtons fancyButtons  save-button" onClick={this.loadGame}>LOAD</button>
                    {/* <h3>Zoom Index: {this.zoomLevel}</h3><br /> */}
                    {/* <h3>RangeCt: {this.userSettings.sliderInfo.rangeSettings.rangeCt}</h3> */}

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
                        onMouseOver={this.onMouseOver}
                    />

                </div>

                <Tabs
                    className="react-tabs-container"
                    selectedIndex={this.tabIndex}
                    onSelect={idx => this.changeTabs(idx)}>

                    {this.getTabList()}

                    <TabPanel className="react-tabs__tab-panel main-tab-panel">

                        <div id="left-sidebar">

                            <Upgrades
                                upgrades={this.state.upgrades}
                                businesses={this.state.businesses}
                                userSettings={this.userSettings}
                                onClick={this.clickUpgrade}
                                enableFeature={this.enableFeature}
                                onMouseOver={this.onMouseOver}
                            />

                        </div>
                        <div id="right-sidebar" onMouseOver={this.onMouseOver} data-tip="right-sidebar">


                            <div className="purchaseAmts" onMouseOver={this.onMouseOver} data-tip="purchaseAmts">

                                <div className="buy-wrapper" onMouseOver={this.onMouseOver} data-tip="purchaseAmts">
                                    <span className="buyx-prefix">Buy {HelperConst.multiplySymbol}</span>
                                    <Dropdown
                                        options={HelperConst.purchaseOpts}
                                        onChange={this.purchaseAmtDropDownHandler}
                                        value={this.purchaseAmt}
                                        placeholder="Select an option"
                                        onMouseOver={this.onMouseOver} />
                                </div>
                            </div>

                            <div id="concentrate-container" onMouseOver={this.onMouseOver} data-tip="concentrate-container">
                                <button
                                    id="concentrateButton"
                                    className={this.state.concentrateClass}
                                    onClick={this.clickConcentrate}
                                    disabled={this.state.concentrate.time === 0 ? false : true}
                                >{this.state.concentrateClass === "concCooldown"
                                    ? "Wait: " + Math.abs(Math.floor(this.state.concentrate.time))
                                    : this.state.concentrateClass === "concActive"
                                        ? HelperConst.concentrateSymbol + " : " + Math.abs(Math.ceil(this.state.concentrate.time))
                                        : "Concentrate " + this.userSettings.concentrate.mult + "x Speed"}
                                </button>
                            </div>

                            {debugButtons}

                            <ToolTip
                                tipText={this.state.tipText}
                                userSettings={this.userSettings}
                                onMouseOver={this.onMouseOver}
                            />

                        </div>

                        <div id="content" onMouseOver={this.onMouseOver} data-tip="content">
                            <div className="container">

                                <Business
                                    businesses={this.state.businesses}
                                    concentrate={this.state.concentrate}
                                    userSettings={this.userSettings}
                                    purchaseAmt={this.purchaseAmt}
                                    onClick={this.clickBusiness}
                                    domRefs={this.domRefs}
                                    onMouseOver={this.onMouseOver}
                                />


                            </div>

                        </div>

                    </TabPanel>

                    {this.getSpaceTab()}

                    <TabPanel className="react-tabs__tab-panel spacer-tab-panel"></TabPanel>

                    {this.getPrestigeTab()}
                    {this.getLogTab()}
                    {this.getSettingsTab()}

                </Tabs>

                <div id="footer">

                    <div id="version">v. 0.0.1</div>
                    <div id="fps">fps:{this.fpsPct}%</div>
                    {this.state.gameSavedObj.content}

                </div>

                <div id="announcements">
                    <Announce
                        announcements={this.state.announcements}
                        onClick={this.clickAnnouncement}
                    />
                </div>

                <MyModal
                    isOpen={this.state.helpModalIsOpen}
                    onRequestClose={this.closeHelpModal}
                    onRequestNext={this.nextModal}
                    title={this.modalTitle}
                    text={this.modalText}
                    remaining={this.modalTexts.length}
                />

            </div>

        )
    }




}

// =====================================================


