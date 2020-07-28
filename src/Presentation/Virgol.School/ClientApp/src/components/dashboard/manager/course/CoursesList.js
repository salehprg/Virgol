import React from 'react';
import {Link} from "react-router-dom";
import CourseCard from "./CourseCard";

class CoursesList extends React.Component {

    renderCards = () => {
        return this.props.courses.map((course) => {
            return (
                <CourseCard

                />
            );
        })
    }

    render() {
        return (
            <div className="w-full grid grid-categories mt-12">
                {this.renderCards()}
            </div>
        );
    }

}

export default CoursesList;