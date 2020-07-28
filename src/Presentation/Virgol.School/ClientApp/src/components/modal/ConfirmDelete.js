import React from 'react';
import Modal from "./Modal";

const ConfirmDelete = (props) => {

    return (
        <Modal cancel={props.onCancel}>
            <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-500 bg-white px-4 py-16 flex flex-col items-center">
                <span className="text-xl">{props.text}</span>
                <div className="w-full flex flex-row justify-center items-center">
                    <button>Ok</button>
                    <button>No</button>
                </div>
            </div>
        </Modal>
    );

}

export default ConfirmDelete;