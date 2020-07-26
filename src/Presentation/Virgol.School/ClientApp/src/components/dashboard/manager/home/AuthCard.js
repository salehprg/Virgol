import React from 'react';

const AuthCard = (props) => {

    return (
        <div className="flex my-2 w-1/3 min-w-120 flex-col items-center">
            <span className="text-2xl font-vb text-blueish">{props.title}</span>
            <span>{props.value}</span>
        </div>
    );

}

export default AuthCard;