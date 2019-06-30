import { Decimal } from 'decimal.js';

export default class ComputeFunc {

    static affordable(item, money, knowledge) {
        if (item.watchType === "money" && item.watchValue.lte(money)) {
            return true;
        };
        if (item.watchType === "knowledge" && item.watchValue.lte(knowledge)) {
            return true;
        };
    }

    static buyPct(num, resource) {
        const pct = resource.div(num).times(100).floor().toNumber()
        // console.log("num:",num.toFixed(),"resource:",resource.toFixed(),"pct:",pct);
        return pct > 100 ? 100 : pct;
    }

    static computeEarning(item, prestige) {
        const num25s = Math.floor(item.owned / 25);
        const mult25 = num25s > 3 ? 3 : num25s;
        const mult100 = Math.floor(item.owned / 100);
        const prestigeMultiplier = prestige.num.times(prestige.val).div(100).plus(1);
        let revenue = new Decimal(
            item.incomeBase
                .times(Math.pow(2, mult25))
                .times(Math.pow(4, mult100))
                .times(item.owned)
                .times(item.upgradeMult)
                .times(prestigeMultiplier)
        );
        return revenue;
    }

    static totalEarning(items, prestige) {
        let revenue = new Decimal(0);

        items.forEach((item) => {
            revenue = revenue.plus(ComputeFunc.computeEarning(item, prestige));
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
                if (maxbuys.Max <= 0) {
                    numBuy = 1;
                } else {
                    numBuy = maxbuys.Max;
                }
                break;
            case "Max OCD":
                // console.log(maxbuys);
                for (const key of ["max100", "max25"]) {
                    // console.log("maxbuys[" + key + "] = " + maxbuys[key]);
                    if (maxbuys[key] > 0
                        && numBuy < maxbuys[key]
                        && maxbuys[key] <= maxbuys.Max) { numBuy = maxbuys[key]; }
                };
                if (numBuy === 0) {
                    numBuy = 25 - (item.owned % 25);
                }
                // console.log("numBuy = " + numBuy);
                break;
            case "Max Upg":
                // item.name === "Lemonade Stand" && console.log(maxbuys);
                const limit100 = (item.owned >= 100 || (item.owned + maxbuys.Max) >= 100) ? true : false;
                const checkOpts = limit100 ? ["max100"] : ["max25"];
                for (const key of checkOpts) {
                    if (maxbuys[key] > 0 && numBuy < maxbuys[key]) { numBuy = maxbuys[key]; }
                };
                if (numBuy === 0) {
                    if (limit100) {
                        numBuy = 100 - (item.owned % 100);
                    } else {
                        numBuy = 25 - (item.owned % 25);
                    }
                }
                // console.log("numBuy = " + numBuy);
                break;
            case "PrimeTime":
                if (maxbuys.PrimeTime <= 0) {
                    numBuy = this.nextPrime(item.owned) - item.owned;
                } else {
                    numBuy = maxbuys.PrimeTime;
                }
                break;
            default:
                numBuy = purchaseAmt;
                break;
        }

        return {
            num: parseInt(numBuy, 10),
            cost: item.costBase.times(
                Math.pow(item.costCoef, item.owned) * (Math.pow(item.costCoef, numBuy) - 1))
                .div(item.costCoef - 1),
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

        let max100 = (Math.floor((max + item.owned) / 100) * 100)
            - item.owned;
        max100 = max100 >= 0 ? max100 : 0;

        let max25 = (Math.floor((max + item.owned) / 25) * 25)
            - item.owned;
        max25 = max25 >= 0 ? max25 : 0;

        const primes = this.primeFactors();
        let primeTime = 0;

        // console.time('primeidx');
        for (const idx in primes) {
            const diff = primes[idx] - item.owned;
            if (diff > 0 && diff < max) {
                primeTime = primes[idx] - item.owned;
            }
            if (diff > max) { break; }
        }
        // console.timeEnd('primeidx');

        return ({
            Max: max,
            PrimeTime: primeTime,
            max25: max25,
            max100: max100,
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