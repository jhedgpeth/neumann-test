// import { Decimal } from 'decimal.js';
const Decimal = require('decimal.js');

export default function UpgradeInit() {

    return ([
        {
            name: "New Shoes",
            watchType: "money",
            watchValue: new Decimal(100),
            costType: "money",
            costValue: new Decimal(500),
            rewardType: "upgradeMult",
            rewardTarget: 0,
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
            rewardTarget: 0,
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "Demographics",
            watchType: "knowledge",
            watchValue: new Decimal(1),
            costType: "knowledge",
            costValue: new Decimal(30),
            rewardType: "upgradeMult",
            rewardTarget: 1,
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
            rewardTarget: 1,
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "Advertising",
            watchType: "knowledge",
            watchValue: new Decimal(30),
            costType: "knowledge",
            costValue: new Decimal(200),
            rewardType: "upgradeMult",
            rewardTarget: 1,
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "Bicycle with Basket",
            watchType: "money",
            watchValue: new Decimal(10e3),
            costType: "money",
            costValue: new Decimal(1e6),
            rewardType: "upgradeMult",
            rewardTarget: 0,
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "Helper",
            watchType: "money",
            watchValue: new Decimal(10e6),
            costType: "money",
            costValue: new Decimal(100e6),
            rewardType: "upgradeMult",
            rewardTarget: 0,
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "Demographics2",
            watchType: "knowledge",
            watchValue: new Decimal(1e3),
            costType: "knowledge",
            costValue: new Decimal(3e3),
            rewardType: "upgradeMult",
            rewardTarget: 1,
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "Sweet Ride2",
            watchType: "money",
            watchValue: new Decimal(10e6),
            costType: "money",
            costValue: new Decimal(25e6),
            rewardType: "upgradeMult",
            rewardTarget: 1,
            rewardValue: 10,
            revealed: false,
            purchased: false,
        },{
            name: "Advertising2",
            watchType: "knowledge",
            watchValue: new Decimal(10e3),
            costType: "knowledge",
            costValue: new Decimal(25e3),
            rewardType: "upgradeMult",
            rewardTarget: 1,
            rewardValue: 10,
            revealed: false,
            purchased: false,
        }

    ]);
}