import React from 'react';
import Notification from "./Notification";

class Header extends React.Component {

    render() {
        return (
            <div className="w-full xl:mt-0 xl:pt-4 pt-8 flex flex-row-reverse justify-start items-center">
                <div className="my-4 flex flex-row-reverse items-center">
                    <span className="text-grayish">{this.props.user.firstName + ' ' + this.props.user.lastName}</span>
                    <Notification />
                </div>
            </div>
        );
    }

}

export default Header;