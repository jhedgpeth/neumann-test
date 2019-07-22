// import { Decimal } from 'decimal.js';
const Decimal = require('decimal.js');

export default function UpgradeInit() {

    return ([
        {
            id: 0,
            name: "New Shoes",
            watchType: "money",
            watchValue: new Decimal(100),
            costType: "money",
            costValue: new Decimal(500),
            rewardType: "upgradeMult",
            rewardTarget: 0,
            rewardValue: 10,
        }, {
            id: 1,
            name: "Demographics",
            watchType: "knowledge",
            watchValue: new Decimal(1),
            costType: "knowledge",
            costValue: new Decimal(30),
            rewardType: "upgradeMult",
            rewardTarget: 1,
            rewardValue: 10,
        }

    ]);
}