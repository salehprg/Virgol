import React from "react";
import {check_circle} from "../../../assets/icons";

const SelectableCard = ({ id, title, isSelected, select , isBigTitle }) => {

    return (
        <div dir="ltr" onClick={() => select(id)} className={`tw-w-full tw-cursor-pointer tw-rounded-lg tw-border-2 ${isSelected? 'tw-border-greenish' : 'tw-border-transparent'} tw-px-1 tw-py-2 tw-flex tw-flex-row-reverse tw-justify-start tw-items-center`}>
            {check_circle('tw-w-8 tw-text-greenish')}
            <span className="tw-text-white tw-mr-2 tw-text-right">{title}</span>
        </div>
    );

}

export default SelectableCard;