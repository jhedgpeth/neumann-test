import React from 'react';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';

export default class Income extends React.Component {


    render() {
        const revenue = ComputeFunc.totalEarning(this.props.businesses);
        const learning = ComputeFunc.totalEarning(this.props.probes);

        return (
            <div className="income">
                <div className="income-money">
                    Money: {HelperConst.moneySymbolSpan()}{HelperConst.showNum(this.props.money)}
                    <br />
                    + {HelperConst.moneySymbolSpan()}{HelperConst.showNum(revenue)}/s
                </div>
                <div className="income-knowledge">
                    Knowledge: {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(this.props.knowledge)}
                    <br />
                    + {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(learning)}/s
                </div>
            </div>

        );

    }


}


