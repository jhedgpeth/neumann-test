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
            name: "Technology Discovered",
            watchType: "businessOwned",
            watchTarget: 0,
            watchValue: 1,
            costType: "money",
            costValue: new Decimal(100),
            rewardType: "enableFeature",
            rewardTarget: "Probes",
        }

    ]);
}