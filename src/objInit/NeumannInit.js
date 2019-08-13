import React from 'react';
import BusinessInit from './BusinessInit';
// import ProbeInit from './ProbeInit';
import UpgradeInit from './UpgradeInit';
import Probe from '../Probe';
import Sliders from '../Sliders';
const Decimal = require('decimal.js');

export default class NeumannInit extends React.Component {

    static freshState = () => ({
        businesses: BusinessInit(),
        upgrades: UpgradeInit(),
        announcements: [],
        modals: [],
        version: "0.0.1",
        concentrate: {
            time: 0,
        },
        concentrateClass: "concIdle",
        tipText: "",
    })

    static userSettings = () => ({
        money: new Decimal(10000),
        knowledge: new Decimal(0),
        probe: new Probe(new Decimal(0),new Decimal(0), 0, 0, 0),
        prestige: { num: new Decimal(0), val: 5 },
        prestigeNext: new Decimal(0),
        lifetimeEarnings: new Decimal(0),
        lifetimeLearning: new Decimal(0),
        curMaxMoney: new Decimal(0),
        curTotalClicks: 0,
        buyMilestone: 0,
        busStats: {
            0: { owned: 1, revealed: false, timeAdj: -1, payoutAdj: 1, },
        },
        upgStats: {},
        featureEnabled: {},
        toggles: {
            overlays: true,
        },
        concentrate: {
            mult: 2.0,
        },
        sliderInfo: {
            rangeSettings: Sliders.getRangeValues(1),
            probePcts: [50, 50, 0],
            probeSpendPct: 25,
        }
    })

}