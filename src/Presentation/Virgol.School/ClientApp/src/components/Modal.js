import React from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => {

    return ReactDOM.createPortal(
        <div className="w-screen h-screen flex justify-center items-center absolute top-0 bg-black bg-opacity-75">
            <div className="md:w-1/3 w-5/6 p-8 flex flex-col items-center bg-white font-vb">
                <span className="py-2 text-center">حذف کنم یا نکنم؟</span>
                <div className="flex md:flex-row flex-col">
                    <button
                        onClick={() => props.accept()}
                        className="px-8 py-2 mx-2 my-2 text-white bg-red-600 rounded-lg focus:outline-none"
                    >میخای بکن</button>
                    <button
                        onClick={() => props.cancel()}
                        className="px-8 py-2 mx-2 my-2 text-red-600 border-2 border-red-600 rounded-lg focus:outline-none"
                    >میخای نکن</button>
                </div>
            </div>
        </div>,
        document.querySelector('#modal')
    );

}

export default Modal;