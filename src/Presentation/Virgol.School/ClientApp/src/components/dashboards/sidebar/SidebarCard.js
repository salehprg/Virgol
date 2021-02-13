import React from "react";

const SidebarCard = ({ active, code, title, icon, changeActive }) => {
    const titleSize = title.length

    return (
        <div onClick={() => changeActive(code)} className={`tw-w-full tw-my-3 tw-cursor-pointer tw-mx-auto tw-px-4 tw-py-3 tw-flex tw-flex-row tw-justify-end tw-items-center tw-rounded-xl tw-transform tw-duration-200 ${active === code ? 'tw-bg-purplish' : 'tw-bg-transparent'}`}>
            <span className={`${titleSize >= 14 ?  `tw-text-sm` : `tw-text-xl`}  tw-text-right tw-text-white tw-mr-2`}>{title}</span>
            {icon('tw-w-8 tw-text-white')}
        </div>
    );

}

export default SidebarCard;