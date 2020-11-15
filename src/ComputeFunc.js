// import { Decimal } from 'decimal.js';
import './styles/fonts.css';
import HelperConst from './HelperConst';
// import Space from './Space';
const Decimal = require('decimal.js');
const mylog = HelperConst.DebugLog;

export default class ComputeFunc {

    static getPct(value, pct) {
        const numType = typeof (value);
        // mylog("Decimal:",value instanceof Decimal);
        // mylog("typeof value:",numType);
        if (value instanceof Decimal) {
            return value.times(pct / 100).floor();
        } else if (numType === "number") {
            return Math.floor(value * (pct / 100));
        }
    }

    static availMaxUpgrade(owned, max) {
        const maxPoss = owned + max;
        if (maxPoss >= 100) {
            const maxCheck = Math.floor(maxPoss / 100) * 100;
            return (maxCheck <= owned) ? maxCheck + 100 : maxCheck;
        } else if (maxPoss >= 75) {
            return (owned >= 75) ? 100 : 75;
        } else if (maxPoss >= 50) {
            return (owned >= 50) ? 75 : 50;
        } else {
            return (owned >= 25) ? 50 : 25;
        }
    }

    static getTotalMilestoneIdx(num) {
        // mylog("testing new milestone:", num);
        let retIdx = -1;
        HelperConst.busBuyMilestones.forEach((milestone, idx) => {
            // mylog("num:",num," milestone:",milestone);
            if (num >= milestone) { retIdx = idx; }
        });
        const num100s = Math.floor(num / 100);
        return (retIdx + num100s);
    }

    static getTotalMilestone(idx) {
        const hardcodeMax = HelperConst.busBuyMilestones.length - 1;
        if (idx <= hardcodeMax) { return HelperConst.busBuyMilestones[idx] };
        const diff = (idx - hardcodeMax);
        return (100 * diff);
    }

    static getTotalMilestonesAttained(fromIdx, toIdx) {
        let milestones = [];
        for (let c = fromIdx + 1; c <= toIdx; c++) {
            milestones.push([this.getTotalMilestone(c)]);
        }
        return milestones;
    }

    static getOwnedMilestonesAttained(fromCt, toCt) {
        const from25s = Math.floor(fromCt / 25) > 3 ? 3 : Math.floor(fromCt / 25);
        const to25s = Math.floor(toCt / 25) > 3 ? 3 : Math.floor(toCt / 25);
        const from100s = Math.floor(fromCt / 100);
        const to100s = Math.floor(toCt / 100);
        let retArr = [];
        if (from25s < to25s) {
            for (let n = from25s + 1; n <= to25s; n++) {
                retArr.push(n * 25);
            }
        }
        if (from100s < to100s) {
            for (let n = from100s + 1; n <= to100s; n++) {
                retArr.push(n * 100);
            }
        }
        mylog("owned milestones:", retArr);
        return retArr;
    }

    static buyPct(num, resource) {
        const pct = resource.div(num).times(100).toNumber()
        return pct > 100 ? 100 : pct;
    }

    static earnPct(item, timeAdj) {
        if (timeAdj < 0.2 || (timeAdj - item.timeCounter) < 0.1) {
            return 100;
        }
        return (item.timeCounter / timeAdj) * 100;
    }

    static getEarningPerTick(revenue, timeInterval) {
        return revenue.times(timeInterval / 1000);
    }

    static getEarningPct(revenue, totalRevenue) {
        return revenue.div(totalRevenue).times(100).toFixed(2);
    }

    // static calcPrestigeEarned(revenue) {
    //     return Decimal.sqrt(revenue.div(Math.pow(10, 9))).times(150).floor();
    // }

    static calcPrestigeEarnedFromLearning(learned) {
        return learned.log(1.99).floor();
    }

    // static calcPrestigeEarnedFromMax(maxEarnings) {
    //     return maxEarnings.div(Math.pow(10, 12)).times(8).plus(1).sqrt().minus(1).div(2);
    // }

    static getCost(item, busStat, purchaseAmt, resource) {

        const maxbuys = this.maxBuy(item, busStat, resource);
        // mylog(maxbuys);
        let numBuy = 0;

        switch (purchaseAmt) {
            case "Max":
            case "Max OCD":
            case "Max Upg":
            case "PrimeTime":
                numBuy = maxbuys[purchaseAmt];
                break;
            default:
                numBuy = purchaseAmt;
                break;
        }

        return {
            num: parseInt(numBuy, 10),
            cost: item.costBase.times(
                Math.pow(item.costCoef, busStat.owned) * 
                (Math.pow(item.costCoef, numBuy) - 1)
            ).div(item.costCoef - 1),
        }
    }

    static maxBuy(item, itemStat, resource) {
        // mylog("resource is ", typeof (resource), ", ", resource.times(1).toFixed());
        const max = parseInt(new Decimal(
            resource
                .times(item.costCoef - 1)
                .div(
                    item.costBase.times(
                        Math.pow(item.costCoef, itemStat.owned))
                )
        ).plus(1).log(item.costCoef).floor(), 10);

        const maxUpg = this.availMaxUpgrade(itemStat.owned, max) - itemStat.owned;

        let maxOcd = (Math.floor((max + itemStat.owned) / 25) * 25)
            - itemStat.owned;
        maxOcd = maxOcd > 0 ? maxOcd : 25 - (itemStat.owned % 25);
        // mylog("maxOcd:", maxOcd, " owned remainder:", (item.owned % 25));

        const primes = this.primeFactors();
        let primeTime = 0;

        // console.time('primeidx');
        const myMaxPrime = itemStat.owned + max;
        for (const idx in primes) {
            if (primes[idx] <= itemStat.owned) continue;
            if (primes[idx] <= myMaxPrime) primeTime = primes[idx];
            if (primes[idx] > myMaxPrime) {
                if (primeTime === 0) primeTime = primes[idx];
                break;
            };
        }
        primeTime -= itemStat.owned;
        // console.timeEnd('primeidx');

        return ({
            Max: max > 0 ? max : 1,
            "Max OCD": maxOcd,
            "Max Upg": maxUpg,
            PrimeTime: primeTime,
        });
    }

    static nextPrime(num) {
        const primes = this.primeFactors();
        for (const idx in primes) {
            if (primes[idx] > num) {
                return primes[idx];
            }
        }
    }

    static primeFactors() {
        if (this.primes) {
            return this.primes;
        }
        var max = 25000;
        var primesFwd = [];
        mylog("creating primes");
        console.time('prime creation');
        var store = [], i, j;
        for (i = 2; i <= max; ++i) {
            if (!store[i]) {
                primesFwd.push(i);
                for (j = i << 1; j <= max; j += i) {
                    store[j] = true;
                }
            }
        }
        // this.primes = primesFwd.reverse();
        this.primes = primesFwd;
        console.timeEnd('prime creation');
        mylog("primes length: " + this.primes.length);
        return this.primes;
    }

    static convertMillis(milliseconds) {
        let day, hour, minute, seconds;
        const showWith0 = value => (value < 10 ? `0${value}` : value);
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return {
            days: showWith0(day),
            hours: showWith0(hour),
            minutes: showWith0(minute),
            seconds: showWith0(seconds)
        };
    }

    static randomEllipsePoint(w, h) {
        const radians = Math.random() * (Math.PI * 2);
        const rho = Math.random();
        const x = Math.sqrt(rho) * Math.cos(radians) * (w / 2);
        const y = Math.sqrt(rho) * Math.sin(radians) * (h / 2);
        return { x: x, y: y };
    }

}