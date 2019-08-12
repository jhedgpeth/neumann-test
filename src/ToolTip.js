import React from 'react';
// import HelperConst from './HelperConst';
// const mylog = HelperConst.DebugLog;

export default class Space extends React.Component {

    render() {
        return (
            <div id="tooltip" onMouseOver={this.props.onMouseOver} data-tip="tooltip">
                <div id="tooltip-text">{this.props.tipText}</div>
            </div>
        )
    }
}