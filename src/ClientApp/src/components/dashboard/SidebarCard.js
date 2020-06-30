import React from "react";

const SidebarCard = (props) => {

    return (
        <div
            className={`w-1/2 min-w-70 w-150 mx-2 md:mx-0 py-4 my-4 rounded-lg flex flex-col items-center ${props.isActive ? 'bg-blueish' : 'bg-white'} cursor-pointer transform hover:scale-110 duration-200`}
            onClick={() => props.onClick(props.id)}
        >
            {props.icon(`md:w-10 md:h-10 w-8 h-8 ${props.isActive ? 'text-white' : 'text-blueish'}`)}
            <span className={`font-vb md:text-md text-md text-center ${props.isActive ? 'text-white' : 'text-dark-green'}`}>{props.title}</span>
        </div>
    );

}

export default SidebarCard;