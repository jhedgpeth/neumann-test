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
                isOpen={this.props.modalIsOpen}
                onAfterOpen={this.props.afterOpenModal}
                onRequestClose={this.props.closeModal}
                contentLabel="Example Modal"
                shouldCloseOnOverlayClick={false}
                className="Modal"
                overlayClassName="Modal-Overlay"
            >
                {/* <h2 ref={subtitle => this.subtitle = subtitle}>{this.props.subtitle}</h2> */}
                <button onClick={this.props.closeModal}>Close</button>
                <div className="modal-text">{this.props.text}</div>

            </Modal>
        )
    }


}