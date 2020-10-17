import React from "react";
import getColor from "../../../../assets/colors";

const RecentClassDetail = ({ weekly , text,day, startTime , endTime , schoolName , className , onStart , onEnd , joinable }) => {

    return (
        <div className="w-full py-2 mt-6 border-b border-grayish">
            <div className="w-full flex flex-row justify-between items-center">
                <span className="w-2/3 text-white mb-4">{weekly == 2 ? 'هفته های فرد' : weekly == 1 ? 'هفته های زوج' : 'هر هفته'} {day} از {startTime} تا {endTime}</span>
                <span className="w-3/4 text-white mb-4">{text}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <span className="text-grayish text-sm">{schoolName} ({className})</span>
                
                <div className="w-2/4 flex flex-wrap flex-row-reverse justify-start items-center">
                    <button onClick={() => onStart()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor((joinable ? 3 : 2))}`}>
                        {(joinable ? "ورود به کلاس" : "ایجاد کلاس")}
                    </button>
                    {(joinable ? 
                        <button onClick={() => onEnd()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor(1)}`}>
                            اتمام کلاس
                        </button> : null )}
                </div>
            </div>
        </div>
    );

}

export default RecentClassDetail;