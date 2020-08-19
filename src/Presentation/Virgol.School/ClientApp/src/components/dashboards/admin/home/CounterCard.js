import React from "react";

const CounterCard = ({ title, icon, number, border, pos , isText }) => {

    return (
        <div className={`${pos} w-full mx-auto rounded-xl py-6 flex flex-row justify-evenly items-center border-2 ${border}`}>
            {(
                isText ? 
                <p className="md:text-3xl text-3xl text-white">{number}</p> 
                : 
                <p className="lg:text-4xl text-3xl text-white">{number}</p>
            )}
            <div className="flex flex-row items-center">
                <span className="lg:text-xl text-right text-sm mx-2 text-white">{title}</span>
                {icon('w-6 text-white')}
            </div>
        </div>
    );

}

export default CounterCard;