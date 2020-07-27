import React from 'react';
import {gear, loading} from "../assets/icons";

const Working = () => {

    return (
        <div className="w-screen h-screen z-50 fixed top-0 bg-white bg-opacity-75 flex justify-center items-center">
            {gear("w-12")}
        </div>
    );

}

export default Working;