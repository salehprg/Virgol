import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import { useTranslation } from 'react-i18next';
import {chevron, translate} from "../../assets/icons";

const SelectLang = ({ showLang, setShowLang }) => {

    const {i18n} = useTranslation();
    const [currentLang, setCurrentLang] = useState(localStorage.getItem('lang') || 'fa');
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "top",
        modifiers: [
            { name: 'offset', options: { offset: [0, 8] } }
        ],
    });

    const whatLang = (lang) => {
        localStorage.setItem('prefLang', lang);
        i18n.changeLanguage(lang);
        setShowLang(false);
        setCurrentLang(lang);
    }

    const show = (e) => {
        e.stopPropagation()
        setShowLang(!showLang)
    }

    return (
        <React.Fragment>
            <div onClick={show} ref={setReferenceElement} className="flex mt-2 z-50 cursor-pointer flex-row justify-between items-center mx-auto w-1/3">
                {translate('w-6 text-white')}
                <span className="text-white">{currentLang}</span>
                {chevron('w-6 transform -rotate-90 text-white')}
            </div>
            <div className={`bg-white z-50 px-4 py-2 rounded-lg z-50 ${showLang ? '' : 'invisible'}`} style={styles.popper} ref={setPopperElement} {...attributes.popper}>
                <button onClick={() => whatLang('fa')} className="my-1 block">فارسی</button>
                <button  onClick={() => whatLang('ar')} className="my-1 block">العربیه</button>
            </div>
        </React.Fragment>
    );
}

export default SelectLang;