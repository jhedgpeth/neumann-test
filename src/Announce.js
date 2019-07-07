import React from 'react';
// import ComputeFunc from './ComputeFunc';
// import HelperConst from './HelperConst';
import './styles/fonts.css';
import './styles/colors.scss';


export default class Announce extends React.Component {

    render() {
        const rows = this.props.announcements.map((item, index) => {
            const annClass = (item.ack) ? "announce-fadeout" : ""
            return (
                <div
                    className={"announcement " + annClass}
                    key={item.id}
                    onClick={() => this.props.onClick(item)}                >
                    <span className="announce-text">{item.text}</span>
                </div>
            )
        })

        return (
            <div className="announce-container" >
                {rows}
            </div>
        )
    }

}