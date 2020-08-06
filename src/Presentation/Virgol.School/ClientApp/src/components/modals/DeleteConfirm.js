import React from 'react';
import Modal from './Modal';

const DeleteConfirm = ({ cancel, confirm, title }) => {

    return(
        <Modal cancel={cancel}>
            <div className="w-11/12 bg-white max-w-500 p-8">
                <p dir="rtl" className="text-center text-xl mb-8">{title}</p>
                <div className="flex justify-center flex-row items-center">
                    <button onClick={confirm} className="px-6 py-1 rounded-lg border-2 border-transparent bg-redish text-white mx-2">تایید</button>
                    <button onClick={cancel} className="px-6 py-1 rounded-lg border-2 border-redish text-redish mx-2">لغو</button>
                </div>
            </div>
        </Modal>
    );

}

export default DeleteConfirm;