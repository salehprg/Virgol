import React from "react";
import getColor from "../../../../assets/colors";

const RecentClassDetail = ({ text, startTime , endTime , schoolName , className , onStart , joinable }) => {

    return (
        <div className="w-full py-2 mt-6 border-b border-grayish">
            <p className="text-white mb-4">{text}</p>
            <div className="w-full flex flex-row justify-between items-center">
                <span className="text-grayish text-sm">{schoolName} ({className})</span>
                
                <div className="w-2/4 flex flex-wrap flex-row-reverse justify-start items-center">
                    <button onClick={() => onStart()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor((joinable ? 3 : 2))}`}>
                        {(joinable ? "ورود به کلاس" : "ایجاد کلاس")}
                    </button>
                </div>
            </div>
        </div>
    );

}

export default RecentClassDetail;