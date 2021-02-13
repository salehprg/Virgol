import React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const NoFound = () => {

    const { t } = useTranslation();

    return (
        <div className="tw-w-screen tw-h-screen tw-bg-dark-blue tw-flex tw-flex-col tw-justify-center tw-items-center">
            <img className="md:tw-w-1/3 tw-w-2/3" src="/Lost Keys-big.png" alt="404 zert" />
            <p className="tw-text-white tw-my-4 tw-text-xl"> {t('notFound')} </p>
            <Link className="tw-link tw-px-10 tw-rounded-lg tw-py-2 tw-bg-greenish tw-text-white" to="/"> {t('enter')} </Link>
        </div>
    );

}

export default NoFound;