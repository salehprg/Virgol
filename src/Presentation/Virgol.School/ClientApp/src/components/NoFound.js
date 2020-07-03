import React from 'react';
import {Link} from "react-router-dom";

const NoFound = () => {

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <span className="text-6xl">404</span>
            <span dir="rtl" className="text-4xl">ما که همچین صفحه ای پیدا نکردیم :(</span>
            <Link to="/" className="px-12 py-2 my-16 rounded-full bg-dark-blue text-white text-3xl">صفحه ورود</Link>
        </div>
    );

}

export default NoFound;