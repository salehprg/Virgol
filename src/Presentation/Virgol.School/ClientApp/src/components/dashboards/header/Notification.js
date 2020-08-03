import React from "react";
import {bell} from "../../../assets/icons";

class Notification extends React.Component {

    render() {
        return (
            <div className="bg-dark-blue p-4 lg:mr-0 mr-6 rounded-b-xl">
                {bell('w-6 text-white')}
            </div>
        );
    }

}

export default Notification;