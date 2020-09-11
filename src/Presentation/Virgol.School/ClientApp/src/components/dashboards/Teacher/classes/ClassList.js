import React from "react";
import ClassCard from "./ClassCard";

class ClassList extends React.Component {

    render() {
        return (
            <div className="grid my-8 teacher-classes-cards">
                <ClassCard
                    id={1}
                    title="حسابان"
                    school="شهید هاشمی نژاد یک"
                    nameOfClass="101"
                />
                <ClassCard
                    id={2}
                    title="حسابان"
                    school="شهید هاشمی نژاد یک"
                    nameOfClass="101"
                />
            </div>
        );
    }

}

export default ClassList;