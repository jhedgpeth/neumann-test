import React from 'react';
import Modal from 'react-modal';
import HelperConst from './HelperConst';
const mylog = HelperConst.DebugLog;

export default class MyModal extends React.Component {

    componentDidMount() {
        mylog("modal didmount");

        Modal.setAppElement('#root');

    }

    render() {

        return (
            <Modal
                isOpen={this.props.isOpen}
                // onAfterOpen={this.afterOpenHelpModal}
                onRequestClose={this.props.onRequestClose}
                contentLabel="Example Modal"
                shouldCloseOnOverlayClick={false}
                className="Modal"
                overlayClassName="Modal-Overlay"
            >
                {/* <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2> */}
                <div className="modal-container">
                    <div className="modalHeader">
                        <div className="modalTitle">{this.props.title}</div>
                        <button
                            className="modalButtons fancyButtons helpModalCloseButton"
                            onClick={this.props.remaining ? this.props.onRequestNext : this.props.onRequestClose}>
                            CLOSE
                        </button>
                    </div>
                    <div className="modalContent">
                        {/* {HelperConst.modalHelp()} */}
                        {this.props.text}
                    </div>
                </div>
            </Modal>
        )
    }


}