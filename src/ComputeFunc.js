import { Decimal } from 'decimal.js';

export default class ComputeFunc {

    static computeEarning(item) {
        const num25s = Math.floor(item.owned / 25);
        const mult25 = num25s > 3 ? 3 : num25s;
        const mult100 = Math.floor(item.owned / 100);
        let revenue = new Decimal(
            item.incomeBase
                .times(Math.pow(2, mult25))
                .times(Math.pow(4, mult100))
                .times(item.owned)
        );
        return revenue;
    }
    
    static totalEarning(items) {
        let revenue = new Decimal(0);
        
        items.forEach((item) => {
            revenue = revenue.plus(ComputeFunc.computeEarning(item));
        });
        return revenue;
    }
    
    static getEarningPerTick(revenue, timeInterval) {
        return revenue.times(timeInterval / 1000);
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
                    if (maxbuys[key] > 0 && numBuy < maxbuys[key]) { numBuy = maxbuys[key]; }
                };
                if (numBuy === 0) {
                    numBuy = 25 - (item.owned % 25);
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
        const max = new Decimal(
            resource
                .times(item.costCoef - 1)
                .div(
                    item.costBase.times(
                        Math.pow(item.costCoef, item.owned))
                )
        ).plus(1).log(item.costCoef).floor();
        let max100 = max.div(100).floor().times(100).minus(item.owned % 100).toFixed(0);
        max100 = max100 >= 0 ? max100 : 0;
        let max25 = max.div(25).floor().times(25).minus(item.owned % 25).toFixed(0);
        max25 = max25 >= 0 ? max25 : 0;
        const primes = this.primeFactors();
        let primeTime = 0;

        // console.time('primeidx');
        for (const idx in primes) {
            const diff = primes[idx] - item.owned;
            if (diff > 0 && diff < max) {
                primeTime = primes[idx] - item.owned;
                break;
            }
        }
        // console.timeEnd('primeidx');

        return ({
            Max: parseInt(max.toFixed(0), 10),
            PrimeTime: primeTime,
            max25: parseInt(max25, 10),
            max100: parseInt(max100, 10),
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