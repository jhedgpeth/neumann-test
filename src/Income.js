import React from 'react';
// import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import './styles/fonts.css';
import './styles/neon.scss';
import Business from './Business';
// const mylog = HelperConst.DebugLog;
const Decimal = require('decimal.js');

export default class Income extends React.Component {


    render() {

        const revenue = Business.computeTotalEarningPerSec(this.props.businesses, this.props.userSettings);
        // const learning = ComputeFunc.computeTotalEarningPerSec(this.props.probes, this.props.prestige);
        const learning = new Decimal(0);

        let rowsLeft = [];
        let rowsRight = [];

        if (this.props.userSettings.prestige.num.gt(0) || this.props.userSettings.prestigeNext.gt(0)) {

            rowsRight.push(
                <React.Fragment>
                    <div className="prestige-header">
                        Prestige:
                    </div>
                    <div className="prestige-units">
                        {HelperConst.prestigeSymbolSpan()}{HelperConst.showInt(this.props.userSettings.prestige.num)}
                    </div>
                    <div className="prestige-earning">
                        (+ {HelperConst.prestigeSymbolSpan()}{HelperConst.showInt(this.props.userSettings.prestigeNext)})
                    </div>
                </React.Fragment>
            )
        }

        if (this.props.userSettings.featureEnabled['Satellite'] && this.props.userSettings.probe.value.gt(0)) {
            rowsLeft.push(
                <React.Fragment>
                    <div className="learning-header">
                        Knowledge:
                    </div>
                    <div className="learning-knowledge">
                        {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(this.props.userSettings.knowledge)}
                    </div>
                    <div className="learning-learning">
                        (+ {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(learning)}/s)
                    </div>
                </React.Fragment>
            )
            rowsRight.push(
                <React.Fragment>
                    <div className="probe-header">
                        Distance:
                    </div>
                    <div className="probe-distance">
                        {HelperConst.showNum(this.props.userSettings.probe.distance)} km
                    </div>
                    <div className="probe-rate">
                        {HelperConst.showNum(this.props.userSettings.probe.getDistPerSec())} km/s
                    </div>
                </React.Fragment>
            )
        }


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


                    {rowsLeft}

                </div>

                <div className="title-wrapper">
                    <div className="von">von</div>
                    <div className="text-effect">
                        <h1 className="neon" data-text="NEUMANN">NEUMANN</h1>
                        <div className="gradient"></div>
                        <div className="spotlight"></div>
                    </div>
                </div>

                <div className="prestige">

                    {rowsRight}

                </div>

            </div>
        );

    }


}


