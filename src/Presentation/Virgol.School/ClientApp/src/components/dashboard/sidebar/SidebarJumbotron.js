import React from 'react';
import ReactTooltip from "react-tooltip";

const SidebarJumbotron = () => {

    return (
        <div className="w-5/6 rounded-lg bg-green-light text-center py-4 px-2">
            <ReactTooltip event='click' globalEventOff='click' />
            <p className="text-dark-green text-center mb-6">
                با ارسال
                <span className="font-vb"> تیکت </span>
                با تیم پشتیبانی در تماس باشید
            </p>
            <button data-tip="هنوز در دسترس نیست" className="text-xl focus:outline-none focus:shadow-outline text-white bg-green rounded-full font-vb px-8 py-1">ارسال تیکت</button>
        </div>
    );

}

export default SidebarJumbotron;