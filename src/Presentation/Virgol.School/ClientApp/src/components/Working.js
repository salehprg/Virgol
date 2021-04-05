import React from "react";
import {working} from "../assets/icons";

const Working = () => {

    return (
        <div className="tw-z-50 tw-w-screen tw-h-screen tw-fixed tw-bg-black-blue tw-bg-tw-opacity-75 tw-flex tw-justify-center tw-items-center">
            {working('tw-w-12 tw-text-grayish')}
        </div>
    );

}

export default Working;