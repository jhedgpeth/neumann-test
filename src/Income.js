import React from 'react';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import './styles/fonts.css';
import './styles/neon.scss';
// const mylog = HelperConst.DebugLog;
const Decimal = require('decimal.js');

export default class Income extends React.Component {


    render() {
        const revenue = ComputeFunc.computeTotalEarningPerSec(this.props.businesses, this.props.userSettings);
        // const learning = ComputeFunc.computeTotalEarningPerSec(this.props.probes, this.props.prestige);
        const learning = new Decimal(0);

        return (
            <div className="header-wrapper">

                <div className="income">

                    <div className="income-header">
                        Money:
                    </div>
                    <div className="income-money">
                        {HelperConst.moneySymbolSpan()}{HelperConst.showNum(this.props.userSettings.money)}
                    </div>
                    <div className="income-earning">
                        (+ {HelperConst.moneySymbolSpan()}{HelperConst.showNum(revenue)}/s)
                    </div>


                    <div className="income-header">
                        Knowledge:
                    </div>
                    <div className="income-knowledge">
                        {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(this.props.userSettings.knowledge)}
                    </div>
                    <div className="income-learning">
                        (+ {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(learning)}/s)
                    </div>

                </div>

                <div className="title-wrapper">
                    <div className="von">von</div>
                    <div className="text-effect">
                        <h1 className="neon" data-text="NEUMANN">NEUMANN</h1>
                        <div className="gradient"></div>
                        {/* <div className="spotlight"></div> */}
                    </div>
                </div>

                <div className="prestige">
                    <div className="prestige-header">
                        Prestige:
                    </div>
                    <div className="prestige-units">
                        {HelperConst.prestigeSymbolSpan()}{HelperConst.showInt(this.props.userSettings.prestige.num)}
                    </div>
                    <div className="prestige-earning">
                        (+ {HelperConst.prestigeSymbolSpan()}{HelperConst.showInt(this.props.userSettings.prestigeNext)})
                    </div>

                    <div className="probe-header">
                        Distance:
                    </div>
                    <div className="probe-distance">
                        {HelperConst.showNum(this.props.userSettings.probe.distance)} km
                    </div>
                    <div className="probe-rate">
                        {HelperConst.showNum(this.props.userSettings.probe.getDistPerSec())} km/s
                    </div>

                </div>

            </div>
        );

    }


}


