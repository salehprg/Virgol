import React from "react";
import { getAllCourses, getAllTeachers } from "../../../../_actions/managerActions";
import {loading} from "../../../../assets/icons";
import {connect} from "react-redux";
import AddCourseModal from "./AddCourseModal";
import protectedManager from "../../../protectedRoutes/protectedManager";
import SearchBar from "../../SearchBar";
import CourseCard from "./CourseCard";

class Courses extends React.Component {

    state = {
        loading: false,
        showAddCourse: false,
        searchQuery: ''
    }

    async componentDidMount() {
        if (this.props.history.action === 'POP' || !this.props.courses || !this.props.teachers) {
            this.setState({loading: true})
            await this.props.getAllCourses(this.props.user.token);
            await this.props.getAllTeachers(this.props.user.token);
            this.setState({loading: false})
        }
    }

    search = (query) => {
        this.setState({ searchQuery: query })
    }

    onCancelAdd = () => {
        this.setState({ showAddCourse: false })
    }

    renderCards = () => {
        return this.props.courses.map((course, i) => {
            return (
                <CourseCard
                    course={course}
                    code={i}
                />
            );
        })
    }

    render() {
        if (this.state.loading) return <div className="flex justify-center items-center">{loading("w-16 text-grayish")}</div>
        if (!this.props.courses) return null;

        return (
            <div className="w-full">
                {this.state.showAddCourse ? <AddCourseModal onAddCancel={this.onCancelAdd} />: null}
                <div className="w-full flex xl:flex-row-reverse flex-col justify-start items-center">
                    <SearchBar
                        value={this.state.searchQuery}
                        search={this.search}
                    />
                    <button onClick={() => this.setState({ showAddCourse: true })} className="py-1 px-8 xl:my-0 my-4 mx-4 bg-sky rounded-full text-white focus:outline-none focus:shadow-outline">درس جدید</button>
                </div>

                <div className="w-full grid grid-categories mt-12">
                    {this.renderCards()}
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.auth.userInfo,
        courses: state.managerData.courses,
        teachers: state.managerData.teachers
    }
}

const authWrapped = protectedManager(Courses)
export default connect(mapStateToProps, { getAllCourses, getAllTeachers })(authWrapped);