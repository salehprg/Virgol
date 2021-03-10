import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { useTranslation } from 'react-i18next';
import {chevron, translate} from "../../assets/icons";

const SelectLang = ({ showLang, setShowLang }) => {

    const {i18n} = useTranslation();
    const [currentLang, setCurrentLang] = useState(localStorage.getItem('prefLang') || 'fa');
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "top",
        modifiers: [
            { name: 'offset', options: { offset: [0, 8] } }
        ],
    });

    // useEffect(() =>{
    //     if(!localStorage.getItem('prefLang')){
    //         localStorage.setItem('prefLang' , 'fa')
    //         this.currentLang
    //     }
    // })

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
            <div onClick={show} ref={setReferenceElement} className="tw-flex tw-mt-2 tw-z-50 tw-cursor-pointer tw-flex-row tw-justify-between tw-items-center tw-mx-auto tw-w-1/3">
                {translate('tw-w-6 tw-text-white')}
                <span className="tw-text-white">{currentLang}</span>
                {chevron('tw-w-6 tw-transform tw-rotate-90 tw-text-white')}
            </div>
            <div className={`tw-bg-white tw-z-50 tw-px-4 tw-py-2 tw-rounded-lg tw-z-50 ${showLang ? '' : 'tw-invisible'}`} style={styles.popper} ref={setPopperElement} {...attributes.popper}>
                <button onClick={() => whatLang('fa')} className="tw-my-1 tw-block">فارسی</button>
                <button  onClick={() => whatLang('ar')} className="tw-my-1 tw-block">العربیه</button>
            </div>
        </React.Fragment>
    );
}

export default SelectLang;