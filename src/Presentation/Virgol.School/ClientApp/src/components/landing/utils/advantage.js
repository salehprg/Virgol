import React from 'react';
import getColor from '../../../assets/colors';

const Advantage = (props) => {
    return(
        <div className={`text-center tw-py-4 tw-my-4 tw-mx-8 tw-shadow-lg tw-rounded px-4 tw-bg-${getColor(props.color)}`}>
            <i className={`tw-mx-auto tw-my-4 tw-text-3xl tw-bg-gray-400 tw-rounded-full tw-p-6 tw-text-${getColor(props.color)} ${props.icon}`} />
            <h5 className="tw-my-4">{props.title}</h5>
        </div>
    )
};  


export default Advantage;