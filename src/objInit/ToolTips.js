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
        `This window shows tooltip text ...like this.`,

    "right-sidebar":
        ` `,

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

    "probe-buy":
        `Buy a probe and launch it into SPACE!`,

    "probe-replace":
        `Buy a new probe - DESTROYS current probe!`,

    "previousProbe":
        `Money spent on previous probe.`,

    "sliderattribs":
        `Choose how much of your current money you want to spend on probes.`,

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
        `You are here-ish.`,

    "space-moon":
        `Our moon (if you live on Earth)`,

    "space-sun":
        `The sun.  So hot right now.`,

    "space-stage-0":
        `Space`,

    "space-stage-1":
        `Space`,

    "space-stage-2":
        <p>
            Did the dev just skip some planets?<br /><br />
            You bet Uranus, he did.
        </p>,

    "space-stage-3":
        `You're really out there now.`,

    "space-stage-4":
        `This is super spacey.  Carl Sagan Cosmos spacey.  Way beyond Kevin levels.`,

    "space-stage":
        `Inky blackness all around.`,

    "space-pulse":
        `This represents the area examined by your probes.`,

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
            // mylog("earnprogress id:", id, "timeAdj:", t, "payoutAdj:", p);
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
            if (tipTextLookup[key]) {
                return tipTextLookup[key];
            }
            return tipTextLookup["space-stage"];
        default:
            if (tipTextLookup[key]) {
                return tipTextLookup[key];
            }
            return key;
    }
}