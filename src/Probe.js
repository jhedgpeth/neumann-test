import React from 'react';
import ComputeFunc from './ComputeFunc';

export default class Probe extends React.Component {


    render() {
        const Decimal = require('decimal.js');
        const numberformat = require('swarm-numberformat');
        this.numberformat = new numberformat.Formatter({ backend: 'decimal.js', sigfigs: 4, format: 'engineering', Decimal: Decimal });

        return (
            <div className="probe">

                {this.props.probes.map((probe) => {
                    return (
                        <button
                            key={probe.name}
                            className="probe-buy"
                            onClick={() => this.props.onClick(probe)}
                        >
                        {probe.owned}x {probe.name}: ${this.numberformat.format(ComputeFunc.getCost(probe).cost)} : ${this.numberformat.format(ComputeFunc.computeEarning(probe).learning)}/s
                        </button>
                    );
                })}

            </div>
        )
    };
}