import React from 'react';
import {bell} from "../../assets/icons";

const Header = (props) => {

    return (
        <div className="w-full xl:mt-0 xl:pt-4 pt-8 flex flex-row-reverse justify-start items-center">
            <div className="my-4 flex flex-row-reverse items-center">
                <span className="text-grayish">{props.user.firstName + ' ' + props.user.lastName}</span>
                <div>
                    {bell("w-6 text-grayish")}
                </div>
            </div>
        </div>
    );

}

export default Header;