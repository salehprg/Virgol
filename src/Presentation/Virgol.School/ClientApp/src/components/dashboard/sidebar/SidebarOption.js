import React from 'react';

class SidebarOption extends React.Component {

    render() {
        const { title, icon, changePanel, term, active } = this.props;
        return (
            <div
                onClick={() => changePanel(term)}
                className="flex flex-row-reverse mb-6 items-center cursor-pointer"
            >
                {icon(`w-6 ${active === term ? 'text-blueish' : 'text-grayish'}`)}
                <span className={`text-xl mx-4 font-vb ${active === term ? 'text-blueish' : 'text-grayish'}`}>{title}</span>
            </div>
        );
    }

}

export default SidebarOption;