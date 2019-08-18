import HelperConst from './HelperConst';

const mylog = HelperConst.DebugLog;
const Decimal = require('decimal.js');

export default class Probe {
    constructor(number, value, pSpeed, pQuality, pCombat) {
        this.value = value;
        this.speed = pSpeed;
        this.quality = pQuality;
        this.combat = pCombat;
        this.number = number;  // Decimal
        this.qualityLoss = new Decimal(0);
        this.combatLoss = new Decimal(0);
        this.distance = new Decimal(0);
        this.finished = false;
    }

    increment(num) {
        this.number = this.number.plus(num);
    }

    goFarther(dist) {
        this.distance = this.distance.plus(dist);
    }

    getDistPerSec() {
        // return this.value.times(this.speed).ln(3);
        if (this.distPerSec) { return this.distPerSec; }
        const speedQ = Math.pow((1 + ((this.speed - 5) / 100)), 2);
        this.distPerSec = this.value.div("1e3").sqrt().times(speedQ).div(2);
        return this.distPerSec;
    }

    getDistPerTick(timeMultiplier) {
        return this.getDistPerSec().times(timeMultiplier);
    }

    getLosses() {
        return Decimal(0);
    }

    getLearned(dist) {
        return dist.times(this.getLiveNumber().sqrt()).div("768e3").times(10).floor().div(10);
    }

    getLearningPerSec() {
        return this.getDistPerSec().times(this.getLiveNumber().sqrt()).div("768e3").times(1000).floor().div(1000);
    }

    getLearningPerTick(timeMultiplier) {
        return this.getLearningPerSec().times(timeMultiplier);
    }

    getLiveNumber() {
        // if (this.number.gt(0)) {
        //     mylog("number:", HelperConst.showNum(this.number), "qual:", HelperConst.showNum(this.qualityLoss.floor()), "combat:", HelperConst.showNum(this.combatLoss));
        //     mylog("livenumber:", HelperConst.showNum(this.number.minus(this.qualityLoss.floor()).minus(this.combatLoss.floor())));
        // }
        return this.number.minus(this.qualityLoss.floor()).minus(this.combatLoss.floor());
    }

    updateNumber() {
        if (this.number.gt(0)) {
            if (this.distance.gt("768e3")) {
                this.number = Decimal(2).pow(this.distance.ln().minus(1.2551545012129809219e1).floor());
            }
            this.qualityLoss = this.qualityLoss.plus(0.005);
            mylog("qualityLoss:", HelperConst.showNum(this.qualityLoss));
        }
    }

    // update(timeMultiplier) {
    //     this.goFarther(this.getDistPerTick(timeMultiplier));
    // }

}