import React from 'react';
import {clear, errorOutline, success} from "../assets/icons";

const Alert = (props) => {

    const icon = () => {
        switch (props.type) {
            case 'alert_success': return success("w-8 text-green-light");
            default: return errorOutline("w-8 text-red-200");
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()} className={`${props.type === 'alert_success' ? 'bg-green' :  'bg-red-500'} flex z-50 flex-row fixed rounded-full items-center justify-between w-5/6 max-w-500 mt-8 ml-8 px-4 py-2`}>
            <div>{icon()}</div>
            <p className="mx-4 text-white">{props.message}</p>
            <div onClick={() => props.fade()} className="cursor-pointer">{clear("w-8 text-white")}</div>
        </div>
    );
}

export default Alert;