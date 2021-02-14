import React from 'react';

const ManagerGenerated = ({ title, value }) => {

    return(
        <div className="tw-w-full tw-my-6">
            <p className="tw-text-white tw-text-right tw-mb-1"> {title} </p>
            <div className="tw-rounded-lg tw-px-4 tw-py-2 tw-border-2 tw-border-pinkish tw-flex tw-flex-row tw-justify-between tw-items-center">
                <span className="tw-text-white"> {value} </span>
            </div>
        </div>
    );

}

export default ManagerGenerated;