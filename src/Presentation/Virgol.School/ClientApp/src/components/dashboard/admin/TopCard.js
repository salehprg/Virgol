import React from 'react';

const TopCard = (props) => {
    return (
        <div className="w-5/6 my-2 py-4 px-2 max-w-300 bg-white flex flex-row-reverse justify-center items-center">
            {props.icon}
            <div className="flex flex-col items-center mx-4">
                <span className="text-dark-green font-vb">{props.title}</span>
                <span className="text-2xl font-vb">{props.number}</span>
            </div>
        </div>
    );
}

export default TopCard;