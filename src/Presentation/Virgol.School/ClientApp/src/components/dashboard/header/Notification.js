import React from 'react';
import { bell } from "../../../assets/icons";

class Notification extends React.Component {

    render() {
        return (
            <div className="cursor-pointer relative">
                {bell("w-6 text-grayish")}
            </div>
        );
    }

}

export default Notification;