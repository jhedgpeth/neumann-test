import React from 'react';
const Decimal = require('decimal.js');

export default function BusinessInit() {

    return ([
        {
            name: "Odd Jobs",
            desc: "desc1",
            owned: 1,
            incomeType: "money",
            incomeBase: new Decimal(1),
            costType: "money",
            costBase: new Decimal(4),
            costCoef: 1.07,
            timeBase: 0.6,
            timeAdjusted: 0.6,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(1),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Newspaper Delivery",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(20),
            costType: "money",
            costBase: new Decimal(60),
            costCoef: 1.15,
            timeBase: 3,
            timeAdjusted: 3,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(60),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Car Wash",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(90),
            costType: "money",
            costBase: new Decimal(720),
            costCoef: 1.14,
            timeBase: 6,
            timeAdjusted: 6,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(540),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Pizza Delivery",
            desc: "desc1",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(360),
            costType: "money",
            costBase: new Decimal(8640),
            costCoef: 1.13,
            timeBase: 12,
            timeAdjusted: 12,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(4320),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Donut Shop",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(2160),
            costType: "money",
            costBase: new Decimal(103680),
            costCoef: 1.12,
            timeBase: 24,
            timeAdjusted: 24,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(51840),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Shrimp Boat",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(6480),
            costType: "money",
            costBase: new Decimal(1244160),
            costCoef: 1.11,
            timeBase: 96,
            timeAdjusted: 96,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(622080),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Hockey Team",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(19440),
            costType: "money",
            costBase: new Decimal(14929920),
            costCoef: 1.10,
            timeBase: 384,
            timeAdjusted: 384,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(7464960),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Movie Studio",
            desc: "desc1",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(58320),
            costType: "money",
            costBase: new Decimal(179159040),
            costCoef: 1.09,
            timeBase: 1536,
            timeAdjusted: 1536,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(89579520),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Bank",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(174960),
            costType: "money",
            costBase: new Decimal(2149908480),
            costCoef: 1.08,
            timeBase: 6144,
            timeAdjusted: 6144,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(1074954240),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }, {
            name: "Oil Company",
            desc: "desc2",
            owned: 0,
            incomeType: "money",
            incomeBase: new Decimal(804816),
            costType: "money",
            costBase: new Decimal(25798901760),
            costCoef: 1.07,
            timeBase: 36864,
            timeAdjusted: 36864,
            timeCounter: 0,
            payout: false,
            initialVisible: new Decimal(29668737024),
            upgradeMult: 1,
            upgradeAdd: 0,
            revealed: false,
            overlays: [],
        }
    ]);

}