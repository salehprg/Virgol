import React from 'react';
import {Link} from "react-router-dom";

class CoursesList extends React.Component {

    renderCards = () => {
        return this.props.courses.map((course) => {
            return (
                <div key={course.id} className="w-5/6 max-w-300 sm:ml-12 ml-0 mb-12 py-4 bg-white flex flex-col items-center">
                    <span className="text-xl text-blueish font-vb">{course.shortname}</span>
                    <span className="my-4" dir="rtl">نام معلم:{course.teacherName}</span>
                    <Link className="w-4/6 py-1 bg-dark-blue text-center text-white rounded-full" to={`/course/${course.id}`}>ویرایش</Link>
                </div>
            );
        })
    }

    render() {
        return (
            <div className="w-full mt-8 flex flex-row-reverse flex-wrap justify-center">
                {this.renderCards()}
            </div>
        );
    }

}

export default CoursesList;