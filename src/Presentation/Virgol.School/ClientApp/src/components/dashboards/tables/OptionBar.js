import React from 'react';
import { withTranslation } from 'react-i18next';
import {x} from "../../../assets/icons";

const OptionBar = (props) => {

    return (
        <div className="w-full flex flex-row justify-center">
            <div className="fixed flex md:flex-row-reverse flex-col justify-between items-center bottom-0 mb-16 mx-auto w-5/6 max-w-800 bg-black rounded-full px-4 py-4">
    <span dir="rtl" className="text-white md:mb-0 mb-4">{props.selectedItems.length} ${this.props.t('selected')}</span>

                <div className="flex flex-row justify-start items-center">
                    <div onClick={props.clear} className="mx-2 cursor-pointer">
                        {x("w-6 text-grayish")}
                    </div>
                    {props.options()}
                </div>
            </div>
        </div>
    );

}

export default withTranslation()(OptionBar);
