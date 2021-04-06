import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';

const QuestionModal = ({ cancel, confirm, title }) => {

    const { t } = useTranslation();

    return(
        <Modal cancel={cancel}>
            <div className="tw-w-11/12 tw-bg-white tw-max-w-500 tw-p-8">
                <p dir="rtl" className="tw-text-center tw-text-lg tw-mb-8">{title}</p>
                <div className="tw-flex tw-justify-center tw-flex-row tw-items-center">
                    <button onClick={confirm} className="tw-px-6 tw-py-1 tw-rounded-lg tw-border-2 tw-border-transparent tw-bg-redish tw-text-white tw-mx-2"> {t('confirm')} </button>
                    <button onClick={cancel} className="tw-px-6 tw-py-1 tw-rounded-lg tw-border-2 tw-border-redish tw-text-redish tw-mx-2"> {t('cancel')} </button>
                </div>
            </div>
        </Modal>
    );

}

export default QuestionModal;