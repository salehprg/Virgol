import React from "react";
import {check_circle} from "../../../assets/icons";

const SelectableCard = ({ id, title, isSelected, select }) => {

    return (
        <div dir="ltr" onClick={() => select(id)} className={`w-full cursor-pointer rounded-lg border-2 ${isSelected? 'border-greenish' : 'border-transparent'} px-1 py-2 flex flex-row-reverse justify-start items-center`}>
            {check_circle('w-8 text-greenish')}
            <span className="text-white mr-2 text-right">{title}</span>
        </div>
    );

}

export default SelectableCard;