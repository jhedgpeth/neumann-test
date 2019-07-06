// import { Decimal } from 'decimal.js';
import './styles/fonts.css';
import HelperConst from './HelperConst';
let Decimal = require('decimal.js');

export default class ComputeFunc {

    static availMaxUpgrade(owned, max) {
        const maxPoss = owned + max;
        if (maxPoss >= 100) {
            const maxCheck = Math.floor(maxPoss / 100) * 100;
            return (maxCheck === owned) ? maxCheck + 100 : maxCheck;
        } else if (maxPoss >= 50) {
            return (owned >= 50) ? 100 : 50;
        } else {
            return (owned >= 25) ? 50 : 25;
        }
    }

    static timeMilestoneIdx(num) {
        // console.log("testing new milestone:", num);
        let retIdx = -1;
        HelperConst.timeMilestones.forEach((milestone, idx) => {
            // console.log("num:",num," milestone:",milestone);
            if (num >= milestone) { retIdx = idx; }
        });
        // const milestoneMax = HelperConst.timeMilestones.length();
        const num100s = Math.floor(num / 100);
        return (retIdx + num100s);
    }

    static getMilestone(idx) {
        const hardcodeMax = HelperConst.timeMilestones.length - 1;
        if (idx <= hardcodeMax) { return HelperConst.timeMilestones[idx] };
        const diff = (idx - hardcodeMax);
        return (100 * diff);
    }

    static affordable(item, money, knowledge) {
        if (item.watchType === "money" && item.watchValue.lte(money)) {
            return true;
        };
        if (item.watchType === "knowledge" && item.watchValue.lte(knowledge)) {
            return true;
        };
    }

    static buyPct(num, resource) {
        const pct = resource.div(num).times(100).toNumber()
        return pct > 100 ? 100 : pct;
    }

    static earnPct(item) {
        if (item.timeAdjusted < 0.2 || (item.timeAdjusted - item.timeCounter)<0.1) {
            return 100;
        }
        return (item.timeCounter / item.timeAdjusted) * 100;
    }

    static computePayoutValueMoney(item, prestige) {
        const num25s = Math.floor(item.owned / 25);
        // 25, 50, 100, 200, ...
        const mult25 = num25s > 2 ? 2 : num25s;
        const mult100 = Math.floor(item.owned / 100);
        const prestigeMultiplier = prestige.num.times(prestige.val).div(100).plus(1);
        let revenue = new Decimal(
            item.incomeBase
                .times(item.owned)
                .times(Math.pow(2, mult25))
                .times(Math.pow(2, mult100))
                .times(item.upgradeMult)
                .times(prestigeMultiplier)
        );
        return revenue;
    }

    static computePayoutValueKnowledge(item, prestige) {
        return item.incomeBase
            .times(item.owned)
            .times(item.upgradeMult);
    }

    static computeEarningPerSec(item, prestige) {
        if (item.incomeType === "money") {
            return this.computePayoutValueMoney(item, prestige).div(item.timeAdjusted);
        } else {
            return this.computePayoutValueKnowledge(item, prestige).div(item.timeAdjusted);
        }
    }

    static computeTotalEarningPerSec(items, prestige) {
        let revenue = new Decimal(0);
        items.forEach((item) => {
            revenue = revenue.plus(this.computeEarningPerSec(item, prestige));
        });
        return revenue;
    }

    static getPayoutMoney(item, prestige) {
        if (!item.payout) { return new Decimal(0) };
        return this.computePayoutValueMoney(item, prestige);
    }

    static getPayoutKnowledge(item, prestige) {
        return this.computePayoutValueKnowledge(item, prestige);
    }

    static getPayout(item, prestige) {
        return item.incomeType === "money"
            ? this.getPayoutMoney(item, prestige)
            : this.getPayoutKnowledge(item, prestige);
    }

    static totalPayout(items, prestige) {
        let revenue = new Decimal(0);

        items.forEach((item) => {
            revenue = revenue.plus(ComputeFunc.getPayout(item, prestige));
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

    static getCost(item, purchaseAmt, resource) {

        const maxbuys = this.maxBuy(item, resource);
        // console.log(maxbuys);
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
                Math.pow(item.costCoef, item.owned) * (Math.pow(item.costCoef, numBuy) - 1)
            ).div(item.costCoef - 1),
        }
    }

    static maxBuy(item, resource) {
        // console.log("resource is ", typeof (resource), ", ", resource.times(1).toFixed());
        const max = parseInt(new Decimal(
            resource
                .times(item.costCoef - 1)
                .div(
                    item.costBase.times(
                        Math.pow(item.costCoef, item.owned))
                )
        ).plus(1).log(item.costCoef).floor(), 10);

        // item.name === "Odd Jobs" && console.log("max:", max, "item.owned:", item.owned, " availmaxupg:", this.availMaxUpgrade(item.owned, max));
        const maxUpg = this.availMaxUpgrade(item.owned, max) - item.owned;

        let maxOcd = (Math.floor((max + item.owned) / 25) * 25)
            - item.owned;
        maxOcd = maxOcd >= 0 ? maxOcd : 25 - item.owned;

        const primes = this.primeFactors();
        let primeTime = 0;

        // console.time('primeidx');
        const primeCheck = item.owned + max;
        for (const idx in primes) {
            if (primeCheck >= primes[idx]) {
                primeTime = primes[idx];
            }
            if (primes[idx] > primeCheck) {
                break;
            }
        }
        primeTime -= item.owned;
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
        console.log("creating primes");
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
        console.log("primes length: " + this.primes.length);
        return this.primes;
    }

}