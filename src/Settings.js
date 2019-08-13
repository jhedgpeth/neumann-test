import React from 'react';

import HelperConst from './HelperConst';
// const mylog = HelperConst.DebugLog;

export default class Settings extends React.Component {

    render() {
        return (
            <div id="settings">
                <div className="toggleHolder">
                    <div className="toggleLabel">Overlays</div>
                    {HelperConst.onoffswitch("overlays", this.props.toggles.overlays, this.props.toggleOverlay)}
                </div>


                
            </div>
        )
    }
}