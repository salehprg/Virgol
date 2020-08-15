import React from "react";
import {arrow_left} from "../../assets/icons";

const Add = ({ onCancel, title, children , newsClassName , isNews}) => {

    return (
        <div className="w-screen relative min-h-screen bg-bold-blue">
            <div onClick={onCancel} className="w-10 h-10 cursor-pointer absolute top-0 left-0 mt-6 ml-6 rounded-lg border-2 border-purplish">
                {arrow_left('w-6 centerize text-purplish')}
            </div>
            <div className={(isNews ? newsClassName : "max-w-350 w-11/12 ") + " centerize"}>
                <p className="text-center text-white mb-6 text-xl">{title}</p>
                {children}
            </div>
        </div>
    );

}

export default Add;