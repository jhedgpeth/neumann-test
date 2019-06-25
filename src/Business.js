import React from 'react';
import ComputeFunc from './ComputeFunc';

export default class Business extends React.Component {


    render() {
        const Decimal = require('decimal.js');
        const numberformat = require('swarm-numberformat');
        this.numberformat = new numberformat.Formatter({ backend: 'decimal.js', sigfigs: 4, format: 'engineering', Decimal: Decimal });

        return (
            <div className="business">

                {this.props.businesses.map((bus) => {
                    return (
                        <button
                            key={bus.name}
                            className="business-buy"
                            onClick={() => this.props.onClick(bus)}
                        >
                            {bus.owned}x {bus.name}: ${this.numberformat.format(ComputeFunc.getCost(bus).cost)} : ${this.numberformat.format(ComputeFunc.computeEarning(bus).revenue)}/s
                        </button>);

                })}

            </div>
        )
    };
};

