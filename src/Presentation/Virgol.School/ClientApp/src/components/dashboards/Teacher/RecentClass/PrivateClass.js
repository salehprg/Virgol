import React from "react";
import { useTranslation } from 'react-i18next';
import getColor from "../../../../assets/colors";

const PrivateClass = ({ text, onEnd , onStart }) => {

    const {t} = useTranslation();
    
    return (
        <div className="tw-w-full tw-py-2 tw-mt-6 tw-border-b tw-border-grayish">
            <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center">
                <span className="tw-w-full tw-text-white tw-mb-4">{text}</span>
            </div>
            <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center">
                <div className="tw-flex tw-flex-wrap tw-flex-row-reverse tw-justify-start tw-items-center">
                    <button onClick={() => onStart()} className={`tw-px-6 tw-py-1 tw-ml-2 tw-mb-2 tw-rounded-full tw-text-white tw-bg-${getColor(3)}`}>
                        {t('copyLink')}
                    </button> 
                    <button onClick={() => onEnd()} className={`tw-px-6 tw-py-1 tw-ml-2 tw-mb-2 tw-rounded-full tw-text-white tw-bg-${getColor(1)}`}>
                        {t('closeLink')}
                    </button>
                </div>
            </div>
        </div>
    );

}

export default PrivateClass;