
// import HelperConst from './HelperConst';
// const mylog = HelperConst.DebugLog;
const Decimal = require('decimal.js');

export default class Probe  {
    constructor(value,pSpeed,pQuality,pDefense) {
        this.value = value;
        this.speed = pSpeed;
        this.quality = pQuality;
        this.defense = pDefense;
        this.number = new Decimal(0);
        this.losses = new Decimal(0);
        this.distance = new Decimal(0);
    }

    increment(num) {
        this.number=this.number.plus(num);
    }
    decrement(num) {
        this.number=this.number.minus(num);
        this.losses =this.losses.plus(num);
    }
    goFarther(dist) {
        this.distance= this.distance.plus(dist);
    }

    update(timeMultiplier) {
        this.goFarther(this.value.times(this.speed));
    }
    
}