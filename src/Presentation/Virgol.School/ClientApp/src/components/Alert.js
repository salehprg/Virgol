import React from 'react';
import {clear, errorOutline, success} from "../assets/icons";

const Alert = (props) => {

    const icon = () => {
        switch (props.type) {
            case 'alert_success': return success("w-12 text-green-600");
            case 'alert_error': return errorOutline("w-12 text-red-600");
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()} className="flex z-50 flex-row fixed mx-auto rounded-md items-center justify-between w-5/6 max-w-500 bg-white shadow-2xl mt-8 ml-8 text-center md:text-xl text-sm text-black px-8 py-4">
            <div>{icon()}</div>
            <span className="mx-4">{props.message}</span>
            <div onClick={() => props.fade()} className="cursor-pointer">{clear("w-8 text-grayish")}</div>
        </div>
    );
}

export default Alert;