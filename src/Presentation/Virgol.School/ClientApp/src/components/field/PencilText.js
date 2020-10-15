import React from 'react';
import { useTranslation } from 'react-i18next';
import { edit } from '../../assets/icons';
import ReactTooltip from "react-tooltip";

const PencilText = ({ text , className, show, showBox, value, changeValue, submit , schoolData , schoolCode , ChangeCode }) => {

    const { t }= useTranslation();

    return (
        <div onClick={e => e.stopPropagation()} className="relative flex flex-row-reverse items-center">
            <ReactTooltip />
            <p className={className}>{text}</p>

            {(schoolData ?
                <p className={"mx-3 " + className}>#{schoolCode}</p>
            : null)}

            <div data-tip={t('edit')} onClick={showBox} className="mx-2">
                {edit('w-6 z-20 text-white cursor-pointer')}
            </div>
            <div className={`absolute text-center z-30 w-48 py-4 px-2 bg-black-blue bottomize ${show ? 'block' : 'hidden'}`}>
                <input 
                    value={value}
                    onChange={(e) => changeValue(e.target.value)}
                    type="text"
                    dir="rtl"
                    placeholder={t('newName')}
                    className={`w-11/12 px-4 py-2 text-white bg-transparent focus:outline-none focus:shadow-outline border-2 border-dark-blue rounded-lg`}
                />

                {(schoolData ? 
                 <input 
                    value={value}
                    onChange={(e) => ChangeCode(e.target.value)}
                    type="text"
                    dir="rtl"
                    placeholder={t('newCode')}
                    className={`w-11/12 px-4 py-2 text-white bg-transparent focus:outline-none focus:shadow-outline border-2 border-dark-blue rounded-lg`}
                />
                :
                null)}

                <button onClick={submit} className={`w-11/12 mt-4 py-2 text-white bg-greenish focus:outline-none focus:shadow-outline rounded-lg`}>
                    {t('save')}
                </button>
            </div>
        </div>
    );

}

export default PencilText;