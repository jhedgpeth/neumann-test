import { Decimal } from 'decimal.js';

export default function UpgradeInit() {

    return ([
        {
            name: "Bigger Lemons",
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
            name: "Auto Juicer",
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
            name: "Demographics",
            watchType: "knowledge",
            watchValue: new Decimal(10),
            costType: "knowledge",
            costValue: new Decimal(30),
            rewardType: "upgradeMult",
            rewardTarget: "Newspaper Delivery",
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "Sweet Ride",
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