import React from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => {

    return ReactDOM.createPortal(
        <div onClick={props.cancel} className="w-screen min-h-screen flex justify-center items-center absolute top-0 bg-black bg-opacity-75">
            {props.children}
        </div>,
        document.querySelector('#modal')
    );

}

export default Modal;