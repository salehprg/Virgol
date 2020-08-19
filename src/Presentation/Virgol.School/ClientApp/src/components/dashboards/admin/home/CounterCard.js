import React from "react";

const CounterCard = ({ title, icon, number, bg, pos , isText }) => {

    return (
        <div className={`${pos} w-full max-w-350 my-3 px-6 mx-auto bg-dark-blue rounded-xl py-4 flex flex-row justify-between items-center`}>
            {(
                isText ? 
                <p className="md:text-3xl text-3xl text-white">{number}</p>
                : 
                <p className="lg:text-4xl text-3xl text-white">{number}</p>
            )}
            <div className="flex flex-row items-center">
                <span className="lg:text-xl text-right text-sm mx-2 text-white">{title}</span>
                <div className={`w-12 h-12 relative rounded-full ${bg}`}>
                    {icon('w-6 text-white centerize')}
                </div>
            </div>
        </div>
    );

}

export default CounterCard;