import React from "react";

const Fieldish = ({ input, type, dir, placeholder, extra, redCondition , id}) => {

    return (
        <input
            id={id}
            dir={dir}
            className={`tw-px-4 tw-py-2 tw-text-white tw-bg-transparent focus:tw-outline-none focus:tw-shadow-outline tw-border-2 ${redCondition ? 'tw-border-redish' : 'tw-border-dark-blue'} tw-rounded-lg ${extra}`}
            {...input}
            type={type}
            placeholder={placeholder}
        />
    );

}

export default Fieldish;