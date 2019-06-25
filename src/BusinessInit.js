import Decimal from 'decimal.js';

export default function BusinessInit() {

    return ([
        {
            name: "business1",
            desc: "desc1",
            owned: 1,
            baseIncome: new Decimal(1),
            baseLearning: new Decimal(0.01),
            baseCost: new Decimal(1),
            baseTime: 1,
            initialVisible: 1,
            costCoef: 1.07,
            incomeMult: [
                { '10' : 2 },
                { 'x25' : 2 },
            ],
        },
        {
            name: "business2",
            desc: "desc2",
            owned: 0,
            baseIncome: new Decimal(20),
            baseLearning: new Decimal(0.02),
            baseCost: new Decimal(60),
            baseTime: 3,
            initialVisible: 60,
            costCoef: 1.15,
            incomeMult: [
                { '10' : 2 },
                { 'x25' : 2 },
            ],
        }
    ]);

}