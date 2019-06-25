import React from 'react';
import ComputeFunc from './ComputeFunc';

export default class Income extends React.Component {

    render() {
        const Decimal = require('decimal.js');
        const numberformat = require('swarm-numberformat');
        this.numberformat = new numberformat.Formatter({ backend: 'decimal.js', sigfigs: 4, format: 'engineering', Decimal: Decimal });
        
        return (
            <div className="income">
                <div className="income-money">
                    Money: ${this.numberformat.format(this.props.money)}
                    <br/>
                    Revenue: ${this.numberformat.format(ComputeFunc.totalEarning(this.props.businesses).revenue)}/s
                </div>
                <div className="income-knowledge">
                    Knowledge: {this.numberformat.format(this.props.knowledge)}
                    <br/>
                    Learning: ${this.numberformat.format(ComputeFunc.totalEarning(this.props.probes).learning)}/s
                </div>
            </div>

        );

    }


}


