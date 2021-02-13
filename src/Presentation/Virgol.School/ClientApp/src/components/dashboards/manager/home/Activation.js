import React from 'react';
import { Link } from 'react-router-dom';

const Activation = ({ expireDate }) => {

    return (
        <div className={`tw-w-full tw-max-w-350 tw-my-3 tw-px-6 tw-mx-auto tw-bg-dark-blue tw-rounded-xl tw-py-4 tw-flex tw-flex-row-reverse tw-justify-between tw-items-center`}>
            <div className="tw-flex tw-flex-col tw-items-right tw-text-right">
                <span className="tw-text-white tw-text-lg">تاریخ اعتبار سامانه</span>
                <span className="tw-text-white">{expireDate}</span>
            </div>
            <Link className="tw-link tw-px-4 tw-py-1 tw-rounded-lg tw-text-greenish tw-border-2 tw-border-greenish" to="/plans">خرید اعتبار</Link>
        </div>
    );

}

export default Activation;