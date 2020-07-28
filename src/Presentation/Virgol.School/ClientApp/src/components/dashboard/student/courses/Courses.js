import React from 'react';
import { connect } from 'react-redux';
import { getCoursesInCat } from "../../../../_actions/userActions";
import CourseCard from "./CourseCard";
import {loading} from "../../../../assets/icons";

class Courses extends React.Component {

    state = { loading: false }

    async componentDidMount() {
        this.setState({loading: true})
        await this.props.getCoursesInCat(this.props.user.token, this.props.user.category.id);
        this.setState({ loading: false })
    }

    renderCards = () => {
        if (!this.props.courses) return null;
        if (this.props.courses.length === 0) return (
            <span className="text-2xl text-grayish block text-center">شما هیچ درس فعالی ندارید</span>
        );
        return this.props.courses.map((course, i) => {
            return (
                <CourseCard
                    name={course.shortname}
                    teacher={course.teacherName ? course.teacherName : 'نامشخص'}
                    url={course.courseUrl}
                    code={i}
                />
            );
        })
    }

    render() {
        if (this.state.loading) return <div className="flex justify-center items-center">{loading("w-16 text-grayish")}</div>
        return (
            <div className="w-full grid grid-courses">
                {this.renderCards()}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { user: state.auth.userInfo, courses: state.userInfo.courses }
}

export default connect(mapStateToProps, { getCoursesInCat })(Courses);