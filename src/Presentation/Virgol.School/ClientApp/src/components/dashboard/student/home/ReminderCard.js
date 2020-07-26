import React from 'react';
import {assignment, quizPlan} from "../../../../assets/icons";

const ReminderCard = (props) => {

    const renderIcon = () => {

        switch (props.type) {
            case "assignment": return (
                <div className="bg-lighter-blueish rounded-lg mx-2">
                    {assignment("w-8 m-2 text-blueish")}
                </div>
            );
            case "exam": return (
                <div className="bg-green-light rounded-lg mx-2">
                    {quizPlan("w-8 m-2 text-green")}
                </div>
            );
        }

    }

    return (
        <div className="w-full mt-4 flex flex-row-reverse justify-start items-center">
            {renderIcon()}
            <div className="text-right mx-2">
                <span className="block font-vb">{props.course + " - " + props.title}</span>
                <span className="block text-sm text-grayish">{props.due}</span>
            </div>
        </div>
    );

}

export default ReminderCard;