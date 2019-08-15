// import { Decimal } from 'decimal.js';
const Decimal = require('decimal.js');

export default function UpgradeInit() {

    return ([
        {
            id: 0,
            name: "Good Night's Rest",
            watchType: "money",
            watchValue: new Decimal("4500"),
            costType: "money",
            costValue: new Decimal("11e3"),
            // costValue: new Decimal("50"),
            rewardType: "upgradeMult",
            rewardTarget: 0,
            rewardValue: 10,
        }, {
            id: 1,
            name: "Strong Coffee",
            watchType: "money",
            watchValue: new Decimal("55e3"),
            costType: "money",
            costValue: new Decimal("75e3"),
            rewardType: "upgradeMult",
            rewardTarget: 0,
            rewardValue: 10,
        }, {
            id: 1000,
            name: "New Technology",
            watchType: "businessOwned",
            watchTarget: 0,
            watchValue: 1,
            costType: "money",
            costValue: new Decimal("100"),
            rewardType: "enableFeature",
            rewardTarget: "Satellite",
        }, {
            id: 1001,
            name: "New Technology",
            watchType: "businessOwned",
            watchTarget: 0,
            watchValue: 1,
            costType: "money",
            costValue: new Decimal("100"),
            rewardType: "enableFeature",
            rewardTarget: "Self-Replication Machinery",
        }, {
            id: 1002,
            name: "New Technology",
            watchType: "businessOwned",
            watchTarget: 6,
            watchValue: 100,
            costType: "money",
            costValue: new Decimal("1e12"),
            rewardType: "enableFeature",
            rewardTarget: "Nano Technology",
        }, {
            id: 1003,
            name: "New Technology",
            watchType: "businessOwned",
            watchTarget: 0,
            watchValue: 1,
            costType: "money",
            costValue: new Decimal("100"),
            rewardType: "enableFeature",
            rewardTarget: "Quality Control",
        }, {
            id: 1004,
            name: "New Technology",
            watchType: "businessOwned",
            watchTarget: 0,
            watchValue: 1,
            costType: "money",
            costValue: new Decimal("100"),
            rewardType: "enableFeature",
            rewardTarget: "Combat",
        }, {
            id: 1100,
            name: "New Ability",
            watchType: "businessOwned",
            watchTarget: 0,
            watchValue: 1,
            costType: "money",
            costValue: new Decimal("100"),
            rewardType: "enableFeature",
            rewardTarget: "Probe Autobuy",
        }

    ]);
}