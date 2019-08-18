import React from 'react';
import HelperConst from '../HelperConst';
const mylog = HelperConst.DebugLog;

const tipTextLookup = {

    "title":
        <p>
            Pretty, yeah?<br />
            From: https://codepen.io/giana/
        </p>,

    "title-wrapper":
        <p>
            Pronunciation:<br />
            German: fun Noy-mon<br />
            English: von Noy-mun<br/>
            Seinfeld: NEWMAN >:(<br/>
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
        default:
            if (tipTextLookup[key]) {
                return tipTextLookup[key];
            }
            return key;
    }
}