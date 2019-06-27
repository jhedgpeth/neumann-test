import {Decimal} from 'decimal.js';

export default function ProbeInit() {

    return ([
        {
            name: "probe1",
            desc: "desc1",
            owned: 1,
            baseIncome: new Decimal(0.01),
            baseLearning: new Decimal(0.05),
            baseCostMoney: new Decimal(1),
            baseCostKnowledge: new Decimal(1),
            baseTime: 1,
            initialVisible: 1,
            costCoef: 1.07,
            incomeMult: [
                { '10': 2 },
                { 'x25': 2 },
            ],
        },
        {
            name: "probe2",
            desc: "desc2",
            owned: 0,
            baseIncome: new Decimal(0.01),
            baseLearning: new Decimal(0.25),
            baseCostMoney: new Decimal(1),
            baseCostKnowledge: new Decimal(60),
            baseTime: 3,
            initialVisible: 60,
            costCoef: 1.15,
            incomeMult: [
                { '10': 2 },
                { 'x25': 2 },
            ],
        }
    ]);

}