import React from 'react';
import BusinessInit from './BusinessInit';
// import ProbeInit from './ProbeInit';
import UpgradeInit from './UpgradeInit';
const Decimal = require('decimal.js');

export default class NeumannInit extends React.Component {

    static freshState = () => ({
        ...this.coreObjOnly(),
        prestige: { num: new Decimal(0), val: 5 },
        prestigeNext: new Decimal(0),
        lifetimeEarnings: new Decimal(0),
        lifetimeLearning: new Decimal(0),
        curMaxMoney: new Decimal(0),
        curTotalClicks: 0,
    });

    static coreObjOnly = () => ({
        money: new Decimal(0),
        knowledge: new Decimal(0),
        businesses: BusinessInit(),
        probes: [],
        upgrades: UpgradeInit(),
        timeMilestone: 0,
        probeDistance: 0,
        announcements: [],
        version: "0.0.1",
    })

}