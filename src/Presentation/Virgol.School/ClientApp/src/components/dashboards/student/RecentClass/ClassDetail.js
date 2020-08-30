import React from "react";
import getColor from "../../../../assets/colors";

const RecentClassDetail = ({ text, startTime , endTime , schoolName , className , onStart , onEnd , joinable }) => {

    return (
        <div className="w-full py-2 mt-6 border-b border-grayish">
            <div className="w-full flex flex-row justify-between items-center">
                <span className="w-1/4 text-white mb-4">از {startTime} تا {endTime}</span>
                <span className="w-3/4 text-white mb-4">{text}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">

            {(joinable ? 
                <div className="flex flex-wrap flex-row-reverse justify-start items-center">
                    <button onClick={() => onStart()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor(3)}`}>
                        ورود به کلاس
                    </button>
                </div>
            :
                <span className="text-redish mb-4">کلاس هنوز اغاز نشده است</span>
            )}
            </div>
        </div>
    );

}

export default RecentClassDetail;