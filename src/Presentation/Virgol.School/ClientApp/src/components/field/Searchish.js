import React from "react";
import { useTranslation } from 'react-i18next';
import {search} from "../../assets/icons";

const Searchish = ({ className, query, changeQuery }) => {

    const { t } = useTranslation();

    return (
        <div className={`tw-flex tw-flex-row-reverse tw-items-center tw-px-2 tw-py-1 tw-rounded-lg tw-border-2 tw-border-purplish ${className}`}>
            {search('tw-w-8 tw-text-purplish tw-transform tw-rotate-90')}
            <input
                className="tw-w-full tw-h-full tw-bg-transparent tw-px-2 tw-text-white tw-placeholder-purplish focus:tw-outline-none"
                type="text"
                dir="rtl"
                placeholder={t('search')}
                value={query}
                onChange={e => changeQuery(e.target.value)}
            />
        </div>
    );

}

export default Searchish;