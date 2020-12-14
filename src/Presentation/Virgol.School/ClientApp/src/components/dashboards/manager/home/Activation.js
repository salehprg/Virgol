import React from 'react';
import { Link } from 'react-router-dom';

const Activation = ({ expireDate }) => {

    return (
        <div className={`w-full max-w-350 my-3 px-6 mx-auto bg-dark-blue rounded-xl py-4 flex flex-row-reverse justify-between items-center`}>
            <div className="flex flex-col items-right text-right">
                <span className="text-white text-lg">تاریخ اعتبار سامانه</span>
                <span className="text-white">{expireDate}</span>
            </div>
            <Link className="px-4 py-1 rounded-lg text-greenish border-2 border-greenish" to="/plans">خرید اعتبار</Link>
        </div>
    );

}

export default Activation;