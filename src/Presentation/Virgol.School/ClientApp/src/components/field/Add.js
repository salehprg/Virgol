import React from "react";
import {arrow_left} from "../../assets/icons";

const Add = ({ onCancel, title, children , newsClassName , isNews}) => {

    return (
        <div className="tw-w-screen tw-relative tw-min-h-screen tw-bg-bold-blue">
            <div onClick={onCancel} className="tw-w-10 tw-h-10 tw-cursor-pointer tw-absolute tw-top-0 tw-left-0 tw-mt-6 tw-ml-6 tw-rounded-lg tw-border-2 tw-border-purplish">
                {arrow_left('tw-w-6 centerize tw-text-purplish')}
            </div>
            <div className={(isNews ? newsClassName : "tw-max-w-350 tw-w-11/12 ") + " centerize"}>
                <p className="tw-text-center tw-text-white tw-mb-6 tw-text-xl">{title}</p>
                {children}
            </div>
        </div>
    );

}

export default Add;