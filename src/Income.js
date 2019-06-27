import React from 'react';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';

export default class Income extends React.Component {

    render() {
        this.numberformat = HelperConst.myFormatter();

        return (
            <div className="income">
                <div className="income-money">
                    Money: <span className="moneySymbol">{HelperConst.moneySymbol}</span>{this.numberformat.format(this.props.money)}
                    <br />
                    Revenue: <span className="moneySymbol">{HelperConst.moneySymbol}</span>{this.numberformat.format(ComputeFunc.totalEarning(this.props.businesses).revenue)}/s
                </div>
                <div className="income-knowledge">
                    Knowledge: <span className="knowledgeSymbol">{HelperConst.knowledgeSymbol}</span>{this.numberformat.format(this.props.knowledge)}
                    <br />
                    Learning: <span className="knowledgeSymbol">{HelperConst.knowledgeSymbol}</span>{this.numberformat.format(ComputeFunc.totalEarning(this.props.probes).learning)}/s
                </div>
            </div>

        );

    }


}


