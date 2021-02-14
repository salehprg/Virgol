import React from "react";
import {eye, eye_off} from "../../assets/icons";

const Passish = ({ input, meta, type, dir, placeholder, extra, redCondition, visible, onChange }) => {

    return (
        <div className={`tw-relative tw-mx-auto ${extra}`}>
            <input
                dir={dir}
                className={`tw-w-full tw-px-4 tw-py-2 tw-text-white tw-bg-transparent focus:tw-outline-none focus:tw-shadow-outline tw-border-2 ${redCondition ? 'tw-border-redish' : 'tw-border-dark-blue'} tw-rounded-lg`}
                {...input}
                type={type}
                placeholder={placeholder}
            />
            <div onClick={onChange} className={`tw-absolute tw-cursor-pointer toggle-pass-vis ${!meta.error ? 'tw-block' : 'tw-hidden'}`}>
                {!visible ? eye('tw-w-4 tw-text-white') : eye_off('tw-w-4 tw-text-white')}
            </div>
        </div>
    );

}

export default Passish;