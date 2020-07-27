import React from 'react';
import {clear, edit, remove} from "../../../assets/icons";

const OptionBar = (props) => {

    return (
        <div className="w-full flex flex-row justify-center">
            <div className="fixed flex md:flex-row-reverse flex-col justify-between items-center bottom-0 mb-16 mx-auto w-5/6 max-w-600 bg-dark-blue rounded-full px-4 py-4">
                <span dir="rtl" className="text-white md:mb-0 mb-4">{props.selectedItems.length} مورد انتخاب شده است</span>

                <div className="flex flex-row justify-start items-center">
                    <div onClick={props.clear} className="mx-2 cursor-pointer">
                        {clear("w-6 text-grayish")}
                    </div>
                    <div className="flex justify-between mx-1 cursor-pointer items-center bg-red-700 rounded-full md:px-6 px-3 py-1">
                        {remove("w-6 mx-1 text-white")}
                        <span className="font-vb mx-1 text-white">حذف</span>
                    </div>
                    {props.selectedItems.length === 1 ?
                        <div className="flex justify-between items-center mx-1 cursor-pointer bg-grayish rounded-full md:px-6 px-3 py-1">
                            {edit("w-6 mx-1 text-white")}
                            <span className="font-vb mx-1 text-white">ویرایش</span>
                        </div>
                        :
                        null
                    }
                </div>
            </div>
        </div>
    );

}

export default OptionBar;