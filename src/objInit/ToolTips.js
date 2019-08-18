import React from 'react';
import HelperConst from '../HelperConst';
const mylog = HelperConst.DebugLog;

const tipTextLookup = {

    "title":
        <p>
            Pretty, yeah?
        </p>,

    "title-wrapper":
        <p>
            Pronunciation:<br />
            German: fun Noy-mon<br />
            English: von Noy-mun<br />
            Seinfeld: NEWMAN >:(<br />
            Lil John: HWhat
        </p>,

    "tooltip":
        `This window shows tooltip text.`,

    "concentrate-container":
        `Press this button to get a temporary speed boost for your businesses.`,

    "purchaseAmts": <p>
        <b>Max</b>: can afford<br />
        <b>MaxOCD</b>: increment of 25<br />
        <b>MaxUPG</b>: next upgrade<br />
        <b>PrimeTime</b>: Prime numbers
        </p>,

    "business-owned":
        `How many you own.`,

    "business-pct":
        `This business' percent of total income`,

    "business-cost":
        `The cost to purchase the chosen amount.`,

    "business-revenue":
        `How much you earn per countdown.`,

    "income-money":
        `The amount of money you have.`,

    "income-earning":
        `Your money income rate.`,

    "learning-knowledge":
        `The amount of knowledge attained.`,

    "learning-learning":
        `Your knowledge learning rate.`,

    "prestige-units":
        `Your current enabled prestige points.`,

    "prestige-earning":
        `The number of points you will attain on your next prestige.`,

    "probe-distance":
        `Total distance traveled by your current probe.`,

    "probe-rate":
        `Velocity of current probe.`,

    "space-probe-count":
        `The number of probes current active, after replication and losses.`,

    "space-combat-loss":
        `The number of probes lost to combat.`,

    "space-failures":
        `The number of probes lost due to systems failure.`,

    "space-zoom":
        `The current represented scale.`,

    "space-name":
        `The name of the current view`,

    "space-earth":
        `A massive looming object is causing tidal stress fractures across the globe!`,

    "space-moon":
        `Our moon (if you live on Earth)`,

    "space-sun":
        `The sun.  So hot right now.`,

    "space-stage-0":
        `Moon view`,

    "space-stage-1":
        `Jupiter view`,

    "space-stage-2":
        <p>
            Did the dev just skip some planets?<br /><br />
            You bet Uranus, I did.
        </p>,


}

const businessInfo = (strings, ...values) => {
    // return `Payout countdown is ${values[0]} seconds.`;
    return <p>
        Countdown is <b>{values[0]}</b> seconds.<br />
        Payout multiplier (from upgrades) is <b>{values[1]}</b>.
    </p>
};








export default function ToolTips(key, userSettings) {
    // mylog("key:",key,"match?:",key.match(/business-buy/));
    let id, t, p;
    switch (key) {
        case (key.match(/^business-buy-/) || {}).input:
            id = key.match(/^business-buy-(\d+)/)[1];
            t = userSettings.busStats[id].timeAdj;
            p = userSettings.busStats[id].payoutAdj;
            return businessInfo`${t} ${p}`;
        case (key.match(/^earn-progress-/) || {}).input:
            id = key.match(/^earn-progress-(\d+)/)[1];
            t = userSettings.busStats[id].timeAdj;
            p = userSettings.busStats[id].payoutAdj;
            mylog("earnprogress id:", id, "timeAdj:", t, "payoutAdj:", p);
            return businessInfo`${t} ${p}`;
        case "space-stage-0":
            if (tipTextLookup[key]) {
                return tipTextLookup[key];
            }
            break;
        case "space-stage-1":
            if (tipTextLookup[key]) {
                return tipTextLookup[key];
            }
            break;
        case "space-stage-2":
            if (tipTextLookup[key]) {
                return tipTextLookup[key];
            }
            break;
        case "space-stage-3":
            if (tipTextLookup[key]) {
                return tipTextLookup[key];
            }
            break;
        case (key.match(/^space-stage-/) || {}).input:
            return tipTextLookup['space'];
        default:
            if (tipTextLookup[key]) {
                return tipTextLookup[key];
            }
            return key;
    }
}