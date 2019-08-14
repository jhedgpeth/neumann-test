import React from 'react';
// import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import './styles/fonts.css';
import './styles/neon.scss';
import Business from './Business';
// const mylog = HelperConst.DebugLog;
// const Decimal = require('decimal.js');

export default class Income extends React.Component {


    render() {

        const revenue = Business.computeTotalEarningPerSec(this.props.businesses, this.props.userSettings, this.props.concentrate);
        // const learning = ComputeFunc.computeTotalEarningPerSec(this.props.probes, this.props.prestige);
        const learning = this.props.userSettings.probe.getLearningPerSec();

        let rowsLeft = [];
        let rowsRight = [];

        if (this.props.userSettings.prestige.num.gt(0) || this.props.userSettings.prestigeNext.gt(0)) {

            rowsRight.push(
                <React.Fragment key="prestige-header">
                    <div className="prestige-header">
                        Prestige:
                    </div>
                    <div className="prestige-units" onMouseOver={this.props.onMouseOver} data-tip="prestige-units">
                        {HelperConst.prestigeSymbolSpan()}{HelperConst.showInt(this.props.userSettings.prestige.num)}
                    </div>
                    <div className="prestige-earning" onMouseOver={this.props.onMouseOver} data-tip="prestige-earning">
                        (+ {HelperConst.prestigeSymbolSpan()}{HelperConst.showInt(this.props.userSettings.prestigeNext)})
                    </div>
                </React.Fragment>
            )
        }

        // space view activated
        if (this.props.userSettings.featureEnabled[1000] && this.props.userSettings.probe.value.gt(0)) {
            rowsLeft.push(
                <React.Fragment key="learning-header">
                    <div className="learning-header">
                        Knowledge:
                    </div>
                    <div className="learning-knowledge" onMouseOver={this.props.onMouseOver} data-tip="learning-knowledge">
                        {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(this.props.userSettings.knowledge)}
                    </div>
                    <div className="learning-learning" onMouseOver={this.props.onMouseOver} data-tip="learning-learning">
                        (+ {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(learning)}/s)
                    </div>
                </React.Fragment>
            )
            rowsRight.push(
                <React.Fragment key="probe-header">
                    <div className="probe-header">
                        Distance:
                    </div>
                    <div className="probe-distance" onMouseOver={this.props.onMouseOver} data-tip="probe-distance">
                        {HelperConst.showNum(this.props.userSettings.probe.distance)} km
                    </div>
                    <div className="probe-rate" onMouseOver={this.props.onMouseOver} data-tip="probe-rate">
                        +{HelperConst.showNum(this.props.userSettings.probe.getDistPerSec())} km/s
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
                    <div className="income-money" onMouseOver={this.props.onMouseOver} data-tip="income-money">
                        {HelperConst.moneySymbolSpan()}{HelperConst.showNum(this.props.userSettings.money)}
                    </div>
                    <div className="income-earning" onMouseOver={this.props.onMouseOver} data-tip="income-earning">
                        (+ {HelperConst.moneySymbolSpan()}{HelperConst.showNum(revenue)}/s)
                    </div>


                    {rowsLeft}

                </div>

                <div className="title-wrapper" onMouseOver={this.props.onMouseOver} data-tip="title-wrapper">
                    <div className="von">von</div>
                    <div className="text-effect" >
                        <h1 className="neon" data-text="NEUMANN" >NEUMANN</h1>
                        <div className="gradient"></div>
                        <div className="spotlight" onMouseOver={this.props.onMouseOver} data-tip="title"></div>
                    </div>
                </div>

                <div className="prestige">

                    {rowsRight}

                </div>

            </div>
        );

    }


}


