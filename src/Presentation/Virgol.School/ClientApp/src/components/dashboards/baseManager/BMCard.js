import React from "react";
import {plus, trash, edit} from "../../../assets/icons";

const BMCard = ({ onAdd, title, editIcon, onEdit, editable, deleteItem, isSelected, showAdd, listed, children}) => {
    return (
        <div className="tw-w-full tw-p-2 tw-h-90 tw-max-h-500 tw-rounded-xl tw-flex tw-flex-col tw-justify-between tw-bg-dark-blue">
            <p className="tw-text-right tw-text-white">{title}</p>
            <div className="tw-w-full tw-relative tw-flex-grow tw-py-6 tw-overflow-auto">
                {children}
            </div>
            <div className={`tw-w-full tw-flex tw-flex-row tw-justify-start tw-items-center ${editable && showAdd  ? 'tw-block' : 'tw-hidden'}`}>
                <div onClick={onAdd} className={`tw-w-12 tw-cursor-pointer tw-h-12 tw-ml-2 tw-mx-2 tw-relative tw-rounded-full tw-bg-greenish ${listed ? 'tw-block' : 'tw-hidden'}`}>
                    {plus('tw-w-6 tw-text-white mt-3 ml-2 pl-1 tw-centerize')}
                </div>
                <div onClick={() => deleteItem(isSelected)} className={`tw-w-12 tw-cursor-pointer tw-h-12 tw-mx-2 tw-relative tw-rounded-full tw-bg-redish ${isSelected && !editIcon ? 'tw-block' : 'tw-hidden'}`}>
                    {trash('tw-w-6 tw-text-white centerize')}
                </div>
                <div onClick={() => onEdit(isSelected)} className={`tw-w-12 tw-cursor-pointer tw-h-12 tw-mx-2 tw-relative tw-rounded-full tw-bg-grayish ${isSelected && editIcon ? 'tw-block' : 'tw-hidden'}`}>
                    {edit('tw-w-6 tw-text-white centerize')}
                </div>
            </div>
        </div>
    );

}

export default BMCard;