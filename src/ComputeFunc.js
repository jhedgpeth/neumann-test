import { Decimal } from 'decimal.js';

export default class ComputeFunc {

    static computeEarning(item) {
        let revenue = new Decimal(
            item.baseIncome
                .times(item.owned)
        );
        let learning = new Decimal(
            item.baseLearning
                .times(item.owned)
        );
        return ({
            revenue: revenue,
            learning: learning,
        });
    }

    static totalEarning(items) {
        let revenue = new Decimal(0);
        let learning = new Decimal(0);

        items.forEach((item) => {
            const earning = ComputeFunc.computeEarning(item);
            revenue = revenue.plus(earning.revenue);
            learning = learning.plus(earning.learning);
        });
        return ({
            revenue: revenue,
            learning: learning,
        });
    }

    static getCost(item) {

        return {
            num: 1,
            money: item.baseCostMoney
                .times(
                    Math.pow(item.costCoef, item.owned)
                    * (Math.pow(item.costCoef, 1) - 1)
                )
                .div(item.costCoef - 1),
            knowledge: item.baseCostKnowledge
                .times(
                    Math.pow(item.costCoef, item.owned)
                    * (Math.pow(item.costCoef, 1) - 1)
                )
                .div(item.costCoef - 1),
        }
    }

    static maxBuy(item, resource) {
        const max = new Decimal(
            resource
                .times(item.costCoef - 1)
                .div(
                    item.baseCost.times(
                        Math.pow(item.costCoef, item.owned))
                )
        ).plus(1).log(item.costCoef).floor();
        const max100 = max.div(100).floor().times(100).minus(item.owned % 100).toFixed(0);
        const max25 = max.div(25).floor().times(25).minus(item.owned % 25).toFixed(0);
        const primes = this.primeFactors();
        let primeTime = 0;

        // console.time('primeidx');
        for (const primeidx in primes) {
            if ((primes[primeidx] - item.owned) < max) {
                primeTime = primes[primeidx] - item.owned;
                break;
            }
        }
        // console.timeEnd('primeidx');

        return ({
            1: 1,
            10: 10,
            25: 25,
            100: 100,
            Max: parseInt(max.toFixed(0), 10),
            PrimeTime: primeTime,
            max25: parseInt(max25, 10),
            max100: parseInt(max100, 10),
        });
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
        this.primes = primesFwd.reverse();
        console.timeEnd('prime creation');
        console.log("primes length: " + this.primes.length);
        return this.primes;
    }

}