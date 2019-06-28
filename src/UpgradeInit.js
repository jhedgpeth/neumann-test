import { Decimal } from 'decimal.js';

export default function UpgradeInit() {

    return ([
        {
            name: "upgrade1",
            watchType: "money",
            watchValue: new Decimal(1e3),
            costType: "money",
            costValue: new Decimal(10e3),
            rewardType: "multiplier",
            rewardTarget: "business1",
            rewardValue: 10,
            purchased: false,
        },{
            name: "upgrade2",
            watchType: "knowledge",
            watchValue: new Decimal(100),
            costType: "knowledge",
            costValue: new Decimal(1e3),
            rewardType: "multiplier",
            rewardTarget: "business2",
            rewardValue: 10,
            purchased: false,
        }

    ]);
}