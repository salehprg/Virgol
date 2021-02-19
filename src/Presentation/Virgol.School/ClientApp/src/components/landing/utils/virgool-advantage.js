import React from 'react';
import getColor from '../../../assets/colors';

const VAdvantage = (props) => (
    <div className="tw-mx-auto text-center tw-shadow-lg tw-p-4 tw-rounded-lg">
        <i className={`${props.icon} tw-text-center tw-text-3xl tw-my-5 tw-text-${getColor(props.color)}`}></i>
        <div >{props.title}</div>
    </div>
)

export default VAdvantage;