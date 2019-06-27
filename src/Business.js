import React from 'react';
import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';


export default class Business extends React.Component {


    render() {
        this.numberformat = HelperConst.myFormatter();
        let rows = [];
        this.props.businesses.forEach((item) => {
            const n = item.name;
            rows.push(
                <div key={n + "button-wrapper"} className="button-wrapper">
                    <button
                        key={n + "button"}
                        className="business-buy"
                        onClick={() => this.props.onClick(item)}>
                        1x {n}
                    </button>
                    <div key={n + "owned"} className="business-owned">{this.numberformat.format(item.owned)}</div>
                </div>
            );

            rows.push(
                <div key={n + "cost-wrapper"} className="cost-wrapper">
                    <div key={n + "cost-money"} className="business-cost-money">{HelperConst.moneySymbolSpan()}{this.numberformat.format(ComputeFunc.getCost(item).money)}</div>
                    <div key={n + "cost-knowledge"} className="business-cost-knowledge">{HelperConst.knowledgeSymbolSpan()}{this.numberformat.format(ComputeFunc.computeEarning(item).revenue)}</div>
                </div>
            );

            rows.push(
                <div key={n + "earning-wrapper"} className="earning-wrapper">
                    <div key={n + "revenue-total"} className="probe-revenue-total">{HelperConst.moneySymbolSpan()}0/s</div>
                    <div key={n + "learning-total"} className="probe-learning-total">{HelperConst.knowledgeSymbolSpan()}0/s</div>
                </div>
            );
        });


        return (
            <div className="business">
                {rows}
            </div>
        )
    };
};

