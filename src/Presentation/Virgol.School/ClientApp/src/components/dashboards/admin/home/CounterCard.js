import React from "react";
import history from "../../../../history";

const CounterCard = ({ title, icon, number, bg, pos , isText , link , userType, match }) => {

    // const change=()=>{
    //     if(link){
    //         history.push(`/${match.url.substring(1,2)}/${link}`)
    //     }
    // }

    return (
        <div className={`${pos} tw-w-full tw-max-w-350 tw-my-3 tw-px-6 tw-mx-auto tw-bg-dark-blue tw-rounded-xl tw-py-4 tw-flex tw-flex-row tw-justify-between tw-items-center`}>
            {(
                isText ? 
                <p className="md:tw-text-3xl tw-text-3xl tw-text-white">{number}</p>
                : 
                <p className="lg:tw-text-4xl tw-text-3xl tw-text-white">{number}</p>
            )}
            <div className="tw-flex tw-flex-row tw-items-center">
                <span className={`lg:tw-text-xl tw-text-right ${link ? '' : null} tw-text-sm tw-mx-2 tw-text-white`}>{title}</span>
                {/* <span onClick={change} className={`lg:tw-text-xl tw-text-right ${link ? 'tw-cursor-pointer' : null} tw-text-sm tw-mx-2 tw-text-white`}>{title}</span> */}
                <div className={`tw-w-12 tw-h-12 tw-relative tw-rounded-full ${bg}`}>
                    {icon('tw-w-6 tw-text-white centerize')}
                </div>
            </div>
        </div>
    );

}

export default CounterCard;