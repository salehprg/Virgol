import React from 'react';
import Modal from "./Modal";

const ConfirmDelete = (props) => {

    return (
        <Modal cancel={props.onCancel}>
            <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-500 bg-white px-4 py-16 flex flex-col items-center">
                <span className="mb-4 text-xl">{props.text}</span>
                <div className="w-full flex flex-row justify-center items-center">
                    <button onClick={props.onConfirm} className="mx-2 px-12 py-2 rounded-xl text-white border-2 border-red-600 bg-red-600 focus:outline-none focus:shadow-outline">بله</button>
                    <button onClick={props.onCancel} className="mx-2 px-12 py-2 rounded-xl text-red-600 border-2 border-red-600 focus:outline-none focus:shadow-outline">خیر</button>
                </div>
            </div>
        </Modal>
    );

}

export default ConfirmDelete;