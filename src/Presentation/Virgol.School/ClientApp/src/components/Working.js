import React from "react";
import {working} from "../assets/icons";

const Working = () => {

    return (
        <div className="z-50 w-screen h-screen fixed bg-black-blue bg-opacity-75 flex justify-center items-center">
            {working('w-12 text-grayish')}
        </div>
    );

}

export default Working;