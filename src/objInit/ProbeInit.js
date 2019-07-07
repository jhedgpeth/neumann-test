// import {Decimal} from 'decimal.js';
const Decimal = require('decimal.js');

export default function ProbeInit() {

    return ([
        {
            name: "Probe1",
            desc: "desc1",
            owned: 1,
            incomeType: "knowledge",
            incomeBase: new Decimal(0.05),
            costType: "knowledge",
            costBase: new Decimal(4),
            costCoef: 1.07,
            timeBase: 1,
            timeAdjusted: 1,
            initialVisible: new Decimal(1),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
        },
    ]);

}