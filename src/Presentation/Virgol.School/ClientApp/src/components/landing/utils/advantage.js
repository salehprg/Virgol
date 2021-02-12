import React from 'react';

const Advantage = (props) => {
    return(
        <div className="text-center py-4 my-4 mx-8 shadow-lg rounded px-4">
            <img className="mx-auto my-4" src={props.link}/>
            <h5 className="my-4">{props.title}</h5>
            <div className="my-4">{props.text}</div>
        </div>
    )
};  


export default Advantage;