import { Decimal } from 'decimal.js';

export default function BusinessInit() {

    return ([
        {
            name: "business1",
            desc: "desc1",
            owned: 1,
            incomeType: "money",
            incomeBase: new Decimal(1.67),
            costType: "money",
            costBase: new Decimal(4),
            costCoef: 1.07,
            timeBase: 1,
            initialVisible: 1,
        },
        {
            name: "business2",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(20),
            costType: "money",
            costBase: new Decimal(60),
            costCoef: 1.15,
            timeBase: 1,
            initialVisible: 60,
        },
    ]);

}