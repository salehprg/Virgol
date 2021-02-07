import React from 'react';

const Advantage = (props) => {
    return(
        <div className="mx-5">
            <img src={props.link}/>
            <h5>{props.title}</h5>
            <div className="text-center">{props.text}</div>
        </div>
    )
};  


export default Advantage;