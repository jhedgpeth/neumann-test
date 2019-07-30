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
            name: "New Technology",
            watchType: "businessOwned",
            watchTarget: 5,
            watchValue: 25,
            costType: "money",
            costValue: new Decimal(100),
            rewardType: "enableFeature",
            rewardTarget: "Satellite",
        }, {
            id: 2,
            name: "New Technology",
            watchType: "businessOwned",
            watchTarget: 6,
            watchValue: 25,
            costType: "money",
            costValue: new Decimal(100),
            rewardType: "enableFeature",
            rewardTarget: "Self-Replication Machinery",
        }, {
            id: 3,
            name: "New Technology",
            watchType: "businessOwned",
            watchTarget: 7,
            watchValue: 25,
            costType: "money",
            costValue: new Decimal(100),
            rewardType: "enableFeature",
            rewardTarget: "Nano Technology",
        }

    ]);
}