import React from "react";
import ReactTooltip from "react-tooltip";
import {check_circle} from "../../../assets/icons";

const SelectableCard = ({ id, title, isSelected, select , needToHide }) => {
    let showTitle = ''
    if(needToHide){
        if(title.length > 7){
            showTitle = title.substring(0,4)+" ..."
        }
        else{
            showTitle = title
        }
    }
    else{
        showTitle = title
    }

    return (
        <div dir="ltr" data-tip={title} onClick={() => select(id)} className={`tw-w-full tw-cursor-pointer tw-rounded-lg tw-border-2 ${isSelected? 'tw-border-greenish' : 'tw-border-transparent'} tw-px-1 tw-py-2 tw-flex tw-flex-row-reverse tw-justify-start tw-items-center`}>
            {check_circle('tw-w-8 tw-text-greenish')}
            <span className="tw-text-white tw-mr-1 tw-text-right">{showTitle}</span>
            <ReactTooltip type="dark" effect="float" place="top"/>
        </div>
        
    );

}

export default SelectableCard;