// import { Decimal } from 'decimal.js';
import './styles/fonts.css';
import HelperConst from './HelperConst';
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
        mylog("owned milestones:",retArr);
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

    static computeNextPayoutValueMoney(item, busStat, prestige, buyNum) {
        const nextOwned = busStat.owned + buyNum;
        const num25s = Math.floor(nextOwned / 25);
        // 25, 50, 75, 100, 200, ...
        const mult25 = num25s > 3 ? 3 : num25s;
        const mult100 = Math.floor(nextOwned / 100);
        const prestigeMultiplier = prestige.num.times(prestige.val).div(100).plus(1);
        let revenue = new Decimal(
            item.incomeBase
                .times(nextOwned)
                .times(Math.pow(2, mult25))
                .times(Math.pow(4, mult100))
                .times(busStat.payoutAdj)
                .times(prestigeMultiplier)
        );
        return revenue;
    }

    static computePayoutValueMoney(item, busStat, prestige) {
        return this.computeNextPayoutValueMoney(item, busStat, prestige, 0);
    }


    static computePayoutValueKnowledge(item, busStat, prestige) {
        return item.incomeBase
            .times(busStat.owned)
            .times(busStat.payoutAdj);
    }

    static computeEarningPerSec(item, busStat, prestige) {
        if (item.incomeType === "money") {
            return this.computePayoutValueMoney(item, busStat, prestige).div(busStat.timeAdj);
        } else {
            return this.computePayoutValueKnowledge(item, busStat, prestige).div(busStat.timeAdj);
        }
    }

    static computeTotalEarningPerSec(items, userSettings) {
        let revenue = new Decimal(0);
        items.forEach((item) => {
            revenue = revenue.plus(this.computeEarningPerSec(item, userSettings.busStats[item.id], userSettings.prestige));
        });
        return revenue;
    }

    static getPayoutMoney(item, busStat, prestige) {
        if (!item.payout) { return new Decimal(0) };
        return this.computePayoutValueMoney(item, busStat, prestige);
    }

    static getPayoutKnowledge(item, busStat, prestige) {
        return this.computePayoutValueKnowledge(item, busStat, prestige);
    }

    static getPayout(item, busStat, prestige) {
        return item.incomeType === "money"
            ? this.getPayoutMoney(item, busStat, prestige)
            : this.getPayoutKnowledge(item, busStat, prestige);
    }

    static totalPayout(items, busStats, prestige) {
        let revenue = new Decimal(0);

        items.forEach((item) => {
            revenue = revenue.plus(ComputeFunc.getPayout(item, busStats[item.id], prestige).times(item.payout));
        });
        return revenue;
    }

    static getEarningPerTick(revenue, timeInterval) {
        return revenue.times(timeInterval / 1000);
    }

    static getEarningPct(revenue, totalRevenue) {
        return revenue.div(totalRevenue).times(100).toFixed(2);
    }

    static calcPrestigeEarned(revenue) {
        return Decimal.sqrt(revenue.div(Math.pow(10, 9))).times(150).floor();
    }

    static calcPrestigeEarnedFromMax(maxEarnings) {
        return maxEarnings.div(Math.pow(10, 12)).times(8).plus(1).sqrt().minus(1).div(2);
    }

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
                Math.pow(item.costCoef, busStat.owned) * (Math.pow(item.costCoef, numBuy) - 1)
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

    static convertDistanceToSpace(d) {
        const numLevels = HelperConst.spaceZoomLevels.length;
        for (let n = 0; n < numLevels; n++) {
            const dist = HelperConst.spaceZoomLevels[n];
            if (dist.gt(d)) return { idx: n, dist: dist, name: HelperConst.spaceZoomLevelNames[n] };
        }
        const baseE9 = HelperConst.spaceZoomLevels[numLevels - 1].log("1e9").floor().toNumber();
        const dFloor = d.log("1e9").floor().toNumber();
        const diff = dFloor - baseE9;
        // const numE10 = numLevels + dFloor.toNumber() - lvlE10;
        // mylog("dFloor:",dFloor,"baseE9:",baseE9);

        return { idx: numLevels + diff, dist: new Decimal("1e9").pow(dFloor + 1), name: "Dark Unknown" };
    }



}