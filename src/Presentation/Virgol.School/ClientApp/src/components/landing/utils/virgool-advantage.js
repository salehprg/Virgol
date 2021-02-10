import React from 'react';

const VAdvantage = (props) => (
    <div className="mx-auto px-5 text-center">
        <i className={props.icon}></i>
        <div className="text-center">{props.title}</div>
    </div>
)

export default VAdvantage;