import React from "react";
import {bell} from "../../../assets/icons";

class Notification extends React.Component {

    render() {
        return (
            <div className="tw-bg-dark-blue tw-p-4 lg:tw-mr-0 tw-mr-6 tw-rounded-b-xl">
                {bell('tw-w-6 tw-text-white')}
            </div>
        );
    }

}

export default Notification;