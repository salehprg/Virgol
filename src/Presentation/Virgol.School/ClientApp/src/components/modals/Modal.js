import React from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => {

    return ReactDOM.createPortal(
        <div onClick={props.cancel} className="tw-w-screen tw-h-screen tw-font-vr tw-z-50 tw-fixed tw-flex tw-justify-center tw-items-center tw-top-0 tw-bg-black tw-bg-tw-opacity-75">
            {props.children}
        </div>,
        document.querySelector('#modal')
    );

}

export default Modal;