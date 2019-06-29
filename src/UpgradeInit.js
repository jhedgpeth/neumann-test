import { Decimal } from 'decimal.js';

export default function UpgradeInit() {

    return ([
        {
            name: "upgrade1",
            watchType: "money",
            watchValue: new Decimal(100),
            costType: "money",
            costValue: new Decimal(500),
            rewardType: "upgradeMult",
            rewardTarget: "Lemonade Stand",
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "upgrade2",
            watchType: "money",
            watchValue: new Decimal(1e3),
            costType: "money",
            costValue: new Decimal(10e3),
            rewardType: "upgradeMult",
            rewardTarget: "Lemonade Stand",
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "upgrade3",
            watchType: "knowledge",
            watchValue: new Decimal(10),
            costType: "knowledge",
            costValue: new Decimal(100),
            rewardType: "upgradeMult",
            rewardTarget: "Newspaper Delivery",
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "upgrade4",
            watchType: "money",
            watchValue: new Decimal(1e3),
            costType: "money",
            costValue: new Decimal(10e3),
            rewardType: "upgradeMult",
            rewardTarget: "Newspaper Delivery",
            rewardValue: 10,
            revealed: false,
            purchased: false,
        }

    ]);
}