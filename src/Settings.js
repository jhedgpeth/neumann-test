import React from 'react';

import HelperConst from './HelperConst';
// const mylog = HelperConst.DebugLog;

export default class Settings extends React.Component {

    render() {
        return (
            <div id="settings">
                <div className="toggleHolder">
                    <div className="toggleLabel">von Visuals</div>
                    {HelperConst.onoffswitch("overlays", this.props.toggles.overlays, this.props.toggleOverlay)}
                </div>

                <div className="toggleHolder">
                    <div className="toggleLabel">von Sound</div>
                    {HelperConst.onoffswitch("sound", this.props.toggles.sound, this.props.toggleSound)}
                </div>

                
            </div>
        )
    }
}