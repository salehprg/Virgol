import React from "react";

const SidebarCard = (props) => {

    return (
        <div
            className={`${props.bg} w-full md:w-1/2 flex flex-col items-center py-3 hover:bg-pri cursor-pointer`}
            onClick={() => props.onClick(props.optionKey)}
        >
            {props.icon}
            <span className="text-white text-center text-lg md:text-lg">{props.title}</span>
        </div>
    );

}

export default SidebarCard;