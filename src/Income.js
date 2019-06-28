import React from 'react';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';

export default class Income extends React.Component {

    moneyStuff() {
        return (<span className="moneySymbol">{HelperConst.moneySymbol}</span>);
    }

    knowledgeStuff() {
        return (<span className="knowledgeSymbol">{HelperConst.knowledgeSymbol}</span>);
    }

    showNum(num) {
        return HelperConst.myFormatter().format(num);
    }

    render() {
        this.numberformat = HelperConst.myFormatter();
        const revenue = ComputeFunc.totalEarning(this.props.businesses);
        const learning = ComputeFunc.totalEarning(this.props.probes);

        return (
            <div className="income">
                <div className="income-money">
                    Money: {this.moneyStuff()}{this.showNum(this.props.money)}
                    <br />
                    Revenue: {this.moneyStuff()}{this.showNum(revenue)}/s
                </div>
                <div className="income-knowledge">
                    Knowledge: {this.knowledgeStuff()}{this.showNum(this.props.knowledge)}
                    <br />
                    Learning: {this.knowledgeStuff()}{this.showNum(learning)}/s
                </div>
            </div>

        );

    }


}


