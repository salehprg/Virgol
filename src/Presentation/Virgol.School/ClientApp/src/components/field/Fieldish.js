import React from "react";

const Fieldish = ({ input, type, dir, placeholder, extra, redCondition }) => {

    return (
        <input
            dir={dir}
            className={`px-4 py-2 text-white bg-transparent focus:outline-none focus:shadow-outline border-2 ${redCondition ? 'border-redish' : 'border-dark-blue'} rounded-lg ${extra}`}
            {...input}
            type={type}
            placeholder={placeholder}
        />
    );

}

export default Fieldish;