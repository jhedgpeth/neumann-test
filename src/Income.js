import React from 'react';
// import { Decimal } from 'decimal.js';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
import './fonts.css';
import './neon.scss';

export default class Income extends React.Component {


    render() {
        const revenue = ComputeFunc.totalEarning(this.props.businesses, this.props.prestige);
        const learning = ComputeFunc.totalEarning(this.props.probes, this.props.prestige);
        // const learning = new Decimal(0);
        const prestigeMultiplier = this.props.prestige.num.times(this.props.prestige.val);

        return (
            <div className="header-wrapper">

                <div className="income">

                    <div className="income-header">
                        Money:
                    </div>
                    <div className="income-money">
                        {HelperConst.moneySymbolSpan()}{HelperConst.showNum(this.props.money)}
                    </div>
                    <div className="income-earning">
                        (+ {HelperConst.moneySymbolSpan()}{HelperConst.showNum(revenue)}/s)
                    </div>


                    <div className="income-header">
                        Knowledge:
                    </div>
                    <div className="income-knowledge">
                        {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(this.props.knowledge)}
                    </div>
                    <div className="income-learning">
                        (+ {HelperConst.knowledgeSymbolSpan()}{HelperConst.showNum(learning)}/s)
                    </div>

                </div>

                <div className="text-effect">
                    <h1 className="neon" data-text="NEUMANN">NEUMANN</h1>
                    <div className="gradient"></div>
                    <div className="spotlight"></div>
                </div>

                <div className="prestige">
                    <div className="prestige-header">
                        Prestige:
                    </div>
                    <div className="prestige-units">
                        {HelperConst.prestigeSymbolSpan()}{HelperConst.showInt(this.props.prestige.num)}
                    </div>
                    <div className="prestige-earning">
                        (+ {HelperConst.prestigeSymbolSpan()}{HelperConst.showInt(this.props.prestigeNext)})
                    </div>

                    <div className="prestige-header">
                        {HelperConst.moneySymbolSpan()}Boost:
                    </div>
                    <div className="prestige-boost">
                        {HelperConst.showInt(prestigeMultiplier)}%
                    </div>

                </div>

            </div>
        );

    }


}


