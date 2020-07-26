import React from 'react';
import {Link} from "react-router-dom";

class CoursesList extends React.Component {

    renderCards = () => {
        return this.props.courses.map((course) => {
            if (course.shortname.includes(this.props.query) || course.teacherName.includes(this.props.query)) {
                return (
                    <div key={course.id} className="w-5/6 max-w-200 sm:ml-12 ml-0 mb-12 py-4 bg-white flex flex-col items-center">
                        <span className="text-xl text-blueish font-vb text-center">{course.shortname}</span>
                        <span className="my-4 text-center" dir="rtl"></span>
                        <Link className="w-4/6 py-1 bg-dark-blue text-center text-white rounded-full" to={`/m/course/${course.id}`}>ویرایش</Link>
                    </div>
                );
            }
        })
    }

    render() {
        return (
            <div className="w-full mt-8 flex flex-row-reverse flex-wrap md:justify-start justify-center">
                {this.renderCards()}
            </div>
        );
    }

}

export default CoursesList;