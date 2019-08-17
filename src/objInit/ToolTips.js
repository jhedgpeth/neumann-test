import React from 'react';

const tipTextLookup = {

    tooltip:
        `This windows shows tooltip text.`,

    'concentrate-container':
        `Press this button the get a temporary speed boost for your businesses.`,

    purchaseAmts:        <p>Max: can afford<br />
            MaxOCD: 25s<br />
            MaxUPG: next upgrade<br />
            PrimeTime: Prime numbers</p>,

}








export default function ToolTips(key) {
    if (tipTextLookup[key]) {
        return tipTextLookup[key];
    }
    return key;
}