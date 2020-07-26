import React from "react";
import {loading} from "../assets/icons";

const Loading = () => {
    return (
        <div className="w-screen h-screen bg-dark-blue flex flex-col justify-center items-center">
            {loading("w-32 text-white")}
        </div>
    );
}

export default Loading;