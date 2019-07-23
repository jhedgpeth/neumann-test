import React from 'react';
import BusinessInit from './BusinessInit';
// import ProbeInit from './ProbeInit';
import UpgradeInit from './UpgradeInit';
import Probe from '../Probe';
const Decimal = require('decimal.js');

export default class NeumannInit extends React.Component {

    static freshState = () => ({
        businesses: BusinessInit(),
        upgrades: UpgradeInit(),
        announcements: [],
        version: "0.0.1",
    })

    static userSettings = () => ({
        money: new Decimal(0),
        knowledge: new Decimal(0),
        probe: new Probe(new Decimal(0), 0, 0, 0),
        prestige: { num: new Decimal(0), val: 5 },
        prestigeNext: new Decimal(0),
        lifetimeEarnings: new Decimal(0),
        lifetimeLearning: new Decimal(0),
        curMaxMoney: new Decimal(0),
        curTotalClicks: 0,
        buyMilestone: 0,
        busStats: {
            0: {owned: 1, revealed: false, timeAdj: 1, payoutAdj: 1, },
            1: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
            2: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
            3: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
            4: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
            5: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
            6: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
            7: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
            8: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
            9: {owned: 0, revealed: false, timeAdj: 1, payoutAdj: 1, },
        },
        upgStats: {
            0: {purchased: false, revealed: false },
            1: {purchased: false, revealed: false },
        }
 

    })

}