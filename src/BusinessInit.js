import { Decimal } from 'decimal.js';

export default function BusinessInit() {

    return ([
        {
            name: "Lemonade Stand",
            desc: "desc1",
            owned: 1,
            incomeType: "money",
            incomeBase: new Decimal(1.67),
            costType: "money",
            costBase: new Decimal(4),
            costCoef: 1.07,
            timeBase: 1,
            initialVisible: 1,
            upgradeMult: 1,
            upgradeAdd: 0,
        },
        {
            name: "Newspaper Delivery",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(20),
            costType: "money",
            costBase: new Decimal(60),
            costCoef: 1.15,
            timeBase: 1,
            initialVisible: 60,
            upgradeMult: 1,
            upgradeAdd: 0,
        },
        {
            name: "Car Wash",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(1090),
            costType: "money",
            costBase: new Decimal(720),
            costCoef: 1.14,
            timeBase: 1,
            initialVisible: 540,
            upgradeMult: 1,
            upgradeAdd: 0,
        }
    ]);

}