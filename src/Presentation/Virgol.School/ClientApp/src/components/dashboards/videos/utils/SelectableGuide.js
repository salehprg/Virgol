import React from 'react';
import history from '../../../../history';

const SelectableGuide = ({title , src , type}) => {
    return(
        <div className="tw-text-center tw-border-4 tw-border-purplish tw-rounded-lg tw-cursor-pointer hover:tw-shadow-xl hover:tw-border-greenish" onClick={() => history.push(`/video/${type}-guide-pr`)}>
            <img src={src} alt="picture"/>
            <div className="tw-text-white tw-py-4 tw-text-xl">{title}</div>
        </div>
    )
}

export default SelectableGuide