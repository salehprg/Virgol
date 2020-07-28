import React from 'react';
import { connect } from 'react-redux';
import {teach} from "../../../../assets/icons";
import {Link} from "react-router-dom";

const CourseCard = (props) => {

    const mainColor = () => {
        switch (props.code % 4) {
            case 0: return "green"
            case 1: return "purple"
            case 2: return "sky"
            case 3: return "magneta"
        }
    }

    const lightColor = () => {
        switch (props.code % 4) {
            case 0: return "green-light2"
            case 1: return "light-purple"
            case 2: return "light-sky"
            case 3: return "light-magneta"
        }
    }

    return (
        <div className={`relative min-w-200 h-32 cursor-pointer flex flex-col justify-evenly items-center bg-${mainColor()}`}>
            <span className={`text-xl text-center font-vb text-white`}>{props.course.shortname}</span>
            <div className="flex flex-row justify-center items-center">
                {teach("w-6 text-white mx-2")}
                <span className="text-white">{props.teacher ? props.teacher.firstName + ' ' + props.teacher.lastName : 'نامشخص'}</span>
            </div>
            <div className="absolute w-full h-full flex justify-center items-center bg-white bg-opacity-75 transition-all duration-500 opacity-0 hover:opacity-100">
                <Link className="py-1 px-8 rounded-full bg-dark-blue text-white font-vb" to={`/course/${props.course.id}`}>بیشتر</Link>
            </div>
        </div>
    );

}

const mapStateToProps = (state, ownProps) => {
    return { teacher: state.managerData.teachers.find(el => el.id === ownProps.course.teacherId) }
}

export default connect(mapStateToProps)(CourseCard);