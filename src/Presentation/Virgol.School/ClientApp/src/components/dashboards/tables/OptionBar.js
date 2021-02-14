import React from 'react';
import { useTranslation } from 'react-i18next';
import {x} from "../../../assets/icons";

const OptionBar = (props) => {

    const {t} = useTranslation();

    return (
        <div className="tw-w-full tw-flex tw-flex-row tw-justify-center">
            <div className="tw-fixed tw-flex md:tw-flex-row-reverse tw-flex-col tw-justify-between tw-items-center tw-bottom-0 tw-mb-16 tw-mx-auto tw-w-5/6 tw-max-w-800 tw-bg-black tw-rounded-full tw-px-4 tw-py-4">
    <span dir="rtl" className="tw-text-white md:tw-mb-0 tw-mb-4">{props.selectedItems.length} {t('selected')}</span>

                <div className="tw-flex tw-flex-row tw-justify-start tw-items-center">
                    <div onClick={props.clear} className="tw-mx-2 tw-cursor-pointer">
                        {x("tw-w-6 tw-text-grayish")}
                    </div>
                    {props.options()}
                </div>
            </div>
        </div>
    );

}

export default OptionBar;
