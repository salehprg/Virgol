import React from "react";

const CounterCard = ({ title, icon, number, border, pos , isText }) => {

    return (
        <div className={`lg:w-48 w-32 ${pos} mx-auto lg:h-48 h-32 rounded-xl flex flex-col justify-center items-center border-2 ${border}`}>
            {(
                isText ? 
                <p className="md:text-3xl text-3xl text-white">{number}</p> 
                : 
                <p className="lg:text-5xl text-3xl text-white">{number}</p>
            )}
            <div className="flex flex-row items-center">
                <span className="lg:text-xl text-right text-sm mx-2 text-white">{title}</span>
                {icon('w-6 text-white')}
            </div>
        </div>
    );

}

export default CounterCard;