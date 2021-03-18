import React from 'react';
import history from '../../../../history';

const SelectableGuide = ({title , src , type, extra}) => {
    return(
        <div className="tw-flex tw-flex-col tw-justify-between tw-items-center tw-p-8 tw-border-4 tw-border-purplish tw-rounded-lg tw-cursor-pointer hover:tw-shadow-xl hover:tw-border-greenish" onClick={() => history.push(`/video/${type}-guide-pr`)}>
            <img className={extra} src={src} alt="در حال بارگزاری تصویر"/>
            <div className="tw-text-white tw-py-4 tw-text-xl">{title}</div>
        </div>
    )
}

export default SelectableGuide