import React from "react";

const SidebarCard = ({ active, code, title, icon, changeActive }) => {

    return (
        <div onClick={() => changeActive(code)} className={`w-full my-3 cursor-pointer mx-auto px-4 py-3 flex flex-row justify-end items-center rounded-xl transform duration-200 ${active === code ? 'bg-purplish' : 'bg-transparent'}`}>
            <span className="text-xl text-right text-white mr-2">{title}</span>
            {icon('w-8 text-white')}
        </div>
    );

}

export default SidebarCard;