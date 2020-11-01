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
            <div onClick={() => setShowLang(!showLang)} ref={setReferenceElement} className="relative mx-1">
                {globe("w-6 text-white cursor-pointer")}
            </div>
            <div className={`bg-white px-4 py-2 rounded-lg z-50 ${showLang ? 'block' : 'hidden'}`} style={styles.popper} ref={setPopperElement} {...attributes.popper}>
                <button onClick={() => whatLang('ar')} className="my-1 block">العربیه</button>
                <button onClick={() => whatLang('fa')} className="my-1 block">فارسی</button>
            </div>
        </div>
    );

}

export default ChangeLang;