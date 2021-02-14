import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import { useTranslation } from 'react-i18next';
import { globe } from "../../../assets/icons";

const ChangeLang = ({ showLang, setShowLang }) => {

    const {i18n} = useTranslation();
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [
            { name: 'offset', options: { offset: [0, 8] } }
        ],
    });

    const whatLang = (lang) => {
        localStorage.setItem('prefLang', lang)
        i18n.changeLanguage(lang)
        setShowLang(false);
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <div onClick={() => setShowLang(!showLang)} ref={setReferenceElement} className="tw-relative tw-mx-1">
                {globe("tw-w-6 tw-text-white tw-cursor-pointer")}
            </div>
            <div className={`tw-bg-white tw-px-4 tw-py-2 tw-rounded-lg tw-z-50 ${showLang ? 'tw-block' : 'tw-hidden'}`} style={styles.popper} ref={setPopperElement} {...attributes.popper}>
                <button onClick={() => whatLang('ar')} className="tw-my-1 tw-block">العربیه</button>
                <button onClick={() => whatLang('fa')} className="tw-my-1 tw-block">فارسی</button>
            </div>
        </div>
    );

}

export default ChangeLang;