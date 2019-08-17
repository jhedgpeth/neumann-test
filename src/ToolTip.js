import React from 'react';
import ToolTips from './objInit/ToolTips';
// import HelperConst from './HelperConst';
// const mylog = HelperConst.DebugLog;

export default class ToolTip extends React.Component {

    render() {
        return (
            <div id="tooltip" onMouseOver={this.props.onMouseOver} data-tip="tooltip">
                <div id="tooltip-text">{ToolTips(this.props.tipText)}</div>
            </div>
        )
    }
}