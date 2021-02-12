import React from 'react';

const VAdvantage = (props) => (
    <div className="mx-auto text-center shadow-lg rounded">
        <i className={props.icon}></i>
        <div >{props.title}</div>
    </div>
)

export default VAdvantage;