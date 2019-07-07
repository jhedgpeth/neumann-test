import BusinessInit from './BusinessInit';
import ProbeInit from './ProbeInit';
import UpgradeInit from './UpgradeInit';
const Decimal = require('decimal.js');

export default function NeumannInit() {

    return ([
        {
            money: new Decimal(1),
            knowledge: new Decimal(0),
            businesses: BusinessInit(),
            probes: ProbeInit(),
            upgrades: UpgradeInit(),
            purchaseAmt: "1",
            prestige: { num: new Decimal(0), val: 5 },
            prestigeNext: new Decimal(0),
            lifetimeEarnings: new Decimal(0),
            lifetimeLearning: new Decimal(0),
            timeMilestone: 0,
            tabIndex: 0,
        }
    ]);

}