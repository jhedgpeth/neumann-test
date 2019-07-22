// import React from 'react';
const Decimal = require('decimal.js');

export default function BusinessInit() {

    return ([
        {
            id: 0,
            name: "Mental Math",
            desc: "desc1",
            owned: 1,
            incomeType: "money",
            incomeBase: new Decimal(1),
            costType: "money",
            costBase: new Decimal(4.67289719626),
            costCoef: 1.04,
            timeBase: 1,
            timeAdjusted: 1,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(0),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 1,
            name: "Research Review",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(60),
            costType: "money",
            costBase: new Decimal(120),
            costCoef: 1.05,
            timeBase: 2,
            timeAdjusted: 2,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(84),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 2,
            name: "Publish Articles",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(660),
            costType: "money",
            costBase: new Decimal(1400),
            costCoef: 1.06,
            timeBase: 4,
            timeAdjusted: 4,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(98015),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 3,
            name: "University Lectures",
            desc: "desc1",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(7400),
            costType: "money",
            costBase: new Decimal(15000),
            costCoef: 1.07,
            timeBase: 8,
            timeAdjusted: 8,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(10500),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 4,
            name: "Publish Papers",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(82000),
            costType: "money",
            costBase: new Decimal(175000),
            costCoef: 1.08,
            timeBase: 12,
            timeAdjusted: 12,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(122500),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 5,
            name: "Game Theory",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(900000),
            costType: "money",
            costBase: new Decimal(1700000),
            costCoef: 1.09,
            timeBase: 20,
            timeAdjusted: 20,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(1190000),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 6,
            name: "Self-Replication Study",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(10000000),
            costType: "money",
            costBase: new Decimal(17000000),
            costCoef: 1.10,
            timeBase: 30,
            timeAdjusted: 30,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(11900000),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 7,
            name: "Manhattan Project",
            desc: "desc1",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(100000000),
            costType: "money",
            costBase: new Decimal(170000000),
            costCoef: 1.11,
            timeBase: 40,
            timeAdjusted: 40,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(119000000),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 8,
            name: "Research Laboratory",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(1000000000),
            costType: "money",
            costBase: new Decimal(1700000000),
            costCoef: 1.12,
            timeBase: 60,
            timeAdjusted: 60,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(1000000000),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            id: 9,
            name: "Government Advisory",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(10000000000),
            costType: "money",
            costBase: new Decimal(17000000000),
            costCoef: 1.05,
            timeBase: 90,
            timeAdjusted: 90,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(9000000000),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }
    ]);

}