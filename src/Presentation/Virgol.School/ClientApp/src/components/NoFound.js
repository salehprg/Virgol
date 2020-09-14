import React from "react";
import { Link } from "react-router-dom";

const NoFound = () => {

    return (
        <div className="w-screen h-screen bg-dark-blue flex flex-col justify-center items-center">
            <img className="md:w-1/3 w-2/3" src="/Lost Keys-big.png" alt="404 zert" />
            <p className="text-white my-4 text-xl">همچین صفحه ای وجود ندارد </p>
            <Link className="px-10 rounded-lg py-2 bg-greenish text-white" to="/">ورود</Link>
        </div>
    );

}

export default NoFound;