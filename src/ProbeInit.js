import {Decimal} from 'decimal.js';

export default function ProbeInit() {

    return ([
        {
            name: "probe1",
            desc: "desc1",
            owned: 1,
            incomeType: "money",
            incomeBase: new Decimal(1),
            costType: "money",
            costBase: new Decimal(1),
            costCoef: 1.07,
            timeBase: 1,
            initialVisible: 1,
            upgradeMult: 1,
            upgradeAdd: 0,
        },
        {
            name: "probe2",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(60),
            costType: "money",
            costBase: new Decimal(60),
            costCoef: 1.14,
            timeBase: 1,
            initialVisible: 60,
            upgradeMult: 1,
            upgradeAdd: 0,
        },
    ]);

}