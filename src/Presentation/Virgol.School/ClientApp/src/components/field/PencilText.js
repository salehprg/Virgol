import React from 'react';
import { useTranslation } from 'react-i18next';
import { edit } from '../../assets/icons';
import ReactTooltip from "react-tooltip";

const PencilText = ({ text , className, show, showBox, value, changeValue, submit , schoolData , schoolCode , ChangeCode }) => {

    const { t }= useTranslation();

    return (
        <div onClick={e => e.stopPropagation()} className="tw-relative tw-flex tw-flex-row-reverse tw-items-center">
            <ReactTooltip />
            <p className={className}>{text}</p>

            {(schoolData ?
                <p className={"tw-mx-3 " + className}>#{schoolCode}</p>
            : null)}

            <div data-tip={t('edit')} onClick={showBox} className="tw-mx-2">
                {edit('tw-w-6 tw-z-20 tw-text-white tw-cursor-pointer')}
            </div>
            <div className={`tw-absolute tw-text-center tw-z-30 tw-w-48 tw-py-4 tw-px-2 tw-bg-black-blue bottomize ${show ? 'tw-block' : 'tw-hidden'}`}>
                <input 
                    value={value}
                    onChange={(e) => changeValue(e.target.value)}
                    type="text"
                    dir="rtl"
                    placeholder={t('newName')}
                    className={`tw-w-11/12 tw-px-4 tw-py-2 tw-text-white tw-bg-transparent focus:tw-outline-none focus:tw-shadow-outline tw-border-2 tw-border-dark-blue tw-rounded-lg`}
                />

                {(schoolData ? 
                 <input 
                    value={value}
                    onChange={(e) => ChangeCode(e.target.value)}
                    type="text"
                    dir="rtl"
                    placeholder={t('newCode')}
                    className={`tw-w-11/12 tw-px-4 tw-py-2 tw-text-white tw-bg-transparent focus:tw-outline-none focus:tw-shadow-outline tw-border-2 tw-border-dark-blue tw-rounded-lg`}
                />
                :
                null)}

                <button onClick={submit} className={`tw-w-11/12 tw-mt-4 tw-py-2 tw-text-white tw-bg-greenish focus:tw-outline-none focus:tw-shadow-outline tw-rounded-lg`}>
                    {t('save')}
                </button>
            </div>
        </div>
    );

}

export default PencilText;