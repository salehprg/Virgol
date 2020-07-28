import React from 'react';
import ReminderCard from "./ReminderCard";

class Reminders extends React.Component {

    render() {
        return (
            <div className="w-full h-55 overflow-auto p-4 rounded-lg text-center bg-white">
                <span className="block font-vb text-2xl text-blueish">یاد آوری ها</span>

                <ReminderCard
                    type="assignment"
                    course="حسابان"
                    title="تمرین سری ششم"
                    due="دوشنبه، 6 مرداد 1399"
                />

                <ReminderCard
                    type="exam"
                    course="حسابان"
                    title="میان ترم"
                    due="جمعه، 10 مرداد 1399"
                />
            </div>
        );
    }

}

export default Reminders;