import React from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => {

    return ReactDOM.createPortal(
        <div onClick={props.cancel} className="w-screen h-screen z-50 fixed flex justify-center items-center top-0 bg-black bg-opacity-75">
            {props.children}
        </div>,
        document.querySelector('#modal')
    );

}

export default Modal;