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
            costBase: new Decimal(5/1.13),
            costCoef: 1.13,
            timeBase: 1,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal(0),
            overlays: [],
        }, {
            id: 1,
            name: "Research Review",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(40),
            costType: "money",
            costBase: new Decimal(120),
            costCoef: 1.14,
            timeBase: 1,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal(40),
            overlays: [],
        }, {
            id: 2,
            name: "Publish Articles",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(160),
            costType: "money",
            costBase: new Decimal(1400),
            costCoef: 1.14,
            timeBase: 4,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal(460),
            overlays: [],
        }, {
            id: 3,
            name: "University Lectures",
            desc: "desc1",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(777),
            costType: "money",
            costBase: new Decimal("28e3"),
            costCoef: 1.14,
            timeBase: 4,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal("9.8e3"),
            overlays: [],
        }, {
            id: 4,
            name: "Author Books",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(3902),
            costType: "money",
            costBase: new Decimal("562e3"),
            costCoef: 1.14,
            timeBase: 12,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal("187e3"),
            overlays: [],
        }, {
            id: 5,
            name: "Game Theory",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(19400),
            costType: "money",
            costBase: new Decimal("11.2e6"),
            costCoef: 1.14,
            timeBase: 12,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal("3.7e6"),
            overlays: [],
        }, {
            id: 6,
            name: "Self-Replication Study",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal("97.7e3"),
            costType: "money",
            costBase: new Decimal("224e6"),
            costCoef: 1.14,
            timeBase: 45,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal("74.7e6"),
            overlays: [],
        }, {
            id: 7,
            name: "Manhattan Project",
            desc: "desc1",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal("487e3"),
            costType: "money",
            costBase: new Decimal("4.49e9"),
            costCoef: 1.14,
            timeBase: 45,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal("1.5e9"),
            overlays: [],
        }, {
            id: 8,
            name: "Research Laboratory",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal("2.45e6"),
            costType: "money",
            costBase: new Decimal("90.18e9"),
            costCoef: 1.14,
            timeBase: 450,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal("30e9"),
            overlays: [],
        }, {
            id: 9,
            name: "Government Advisory",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal("16.4e6"),
            costType: "money",
            costBase: new Decimal("1.811e12"),
            costCoef: 1.12,
            timeBase: 900,
            timeCounter: 0,
            payout: 0,
            initialVisible: new Decimal("905e9"),
            overlays: [],
        }
    ]);

}