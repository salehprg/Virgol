import React from "react";
import {plus, trash, edit} from "../../../assets/icons";

const BMCard = ({ onAdd, title, editIcon, onEdit, editable, deleteItem, isSelected, showAdd, listed, children}) => {

    return (
        <div className="w-full p-2 h-90 max-h-500 rounded-xl flex flex-col justify-between bg-dark-blue">
            <p className="text-right text-white">{title}</p>
            <div className="w-full relative flex-grow py-6 overflow-auto">
                {children}
            </div>
            <div className={`w-full flex flex-row justify-start items-center ${editable && showAdd != null ? 'block' : 'hidden'}`}>
                <div onClick={onAdd} className={`w-12 cursor-pointer h-12 mx-2 relative rounded-full bg-greenish ${listed ? 'block' : 'hidden'}`}>
                    {plus('w-6 text-white centerize')}
                </div>
                <div onClick={() => deleteItem(isSelected)} className={`w-12 cursor-pointer h-12 mx-2 relative rounded-full bg-redish ${isSelected && !editIcon ? 'block' : 'hidden'}`}>
                    {trash('w-6 text-white centerize')}
                </div>
                <div onClick={() => onEdit(isSelected)} className={`w-12 cursor-pointer h-12 mx-2 relative rounded-full bg-grayish ${isSelected && editIcon ? 'block' : 'hidden'}`}>
                    {edit('w-6 text-white centerize')}
                </div>
            </div>
        </div>
    );

}

export default BMCard;