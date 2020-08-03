import React from "react";
import {eye, eye_off} from "../../assets/icons";

const Passish = ({ input, meta, type, dir, placeholder, extra, redCondition, visible, onChange }) => {

    return (
        <div className={`relative mx-auto ${extra}`}>
            <input
                dir={dir}
                className={`w-full px-4 py-2 text-white bg-transparent focus:outline-none focus:shadow-outline border-2 ${redCondition ? 'border-redish' : 'border-dark-blue'} rounded-lg`}
                {...input}
                type={type}
                placeholder={placeholder}
            />
            <div onClick={onChange} className={`absolute cursor-pointer toggle-pass-vis ${!meta.error ? 'block' : 'hidden'}`}>
                {!visible ? eye('w-4 text-white') : eye_off('w-4 text-white')}
            </div>
        </div>
    );

}

export default Passish;