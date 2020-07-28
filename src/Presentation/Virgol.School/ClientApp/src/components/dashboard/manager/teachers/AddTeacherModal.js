import React from 'react';
import Modal from "../../../modal/Modal";

class AddTeacherModal extends React.Component {

    render() {
        return (
            <Modal cancel={this.props.onAddCancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-1000 h-64 bg-white px-4 py-16 flex flex-col justify-center items-end">

                </div>
            </Modal>
        );
    }

}

export default AddTeacherModal;