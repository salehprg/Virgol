import React from 'react';
import { connect } from 'react-redux';
import { getCatCourses, getAllCourses, deleteCourseFromCat } from "../../../../_actions/managerActions";
import Loading from "../../../Loading";
import CourseCard from "./CourseCard";
import {plus} from "../../../../assets/icons";
import AddCourseModal from "./AddCourseModal";

class CategoryInfo extends React.Component {

    state = { loading: false, confirm: null, showAddCourseModal: false }

    async componentDidMount() {
        this.setState({loading: true})
        await this.props.getCatCourses(this.props.token, parseInt(this.props.match.params.id));
        await this.props.getAllCourses(this.props.token);
        this.setState({loading: false})
    }


    renderCourses = () => {
        return this.props.courses.map((course, i) => {
            return (
                <CourseCard
                    key={course.id}
                    course={course}
                    showConfirm={(id) => this.setState({ confirm: id })}
                    confirm={this.state.confirm}
                    delete={this.deleteCourse}
                    code={i}
                />
            );
        })
    }

    deleteCourse = (id) => {
        this.setState({ confirm: null })
        this.props.deleteCourseFromCat(this.props.token, id)
    }

    render() {
        if (!this.props.courses) return null;
        if (this.state.loading) return <Loading />
        return (
            <div onClick={() => this.setState({ confirm: null })} className="w-screen min-h-screen bg-light-white flex md:flex-row flex-col-reverse justify-evenly items-center">
                {this.state.showAddCourseModal ?
                    <AddCourseModal
                        onAddCancel={() => this.setState({ showAddCourseModal: false })}
                        ownCourses={this.props.courses}
                        catId={parseInt(this.props.match.params.id)}
                    />
                    :
                    null
                }
                <div className="md:w-3/12 w-11/12 relative bg-white flex flex-col items-center rounded-xl h-90">
                    {this.renderCourses()}
                    <div onClick={() => this.setState({ showAddCourseModal: true })} className="absolute cursor-pointer bottom-0 right-0 mr-6 mb-6 w-12 h-12 flex justify-center items-center rounded-full bg-blueish">
                        {plus("w-10 text-white")}
                    </div>
                </div>
                <div className="md:w-8/12 w-11/12 bg-white h-90">
                     
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { token: state.auth.userInfo.token, courses: state.managerData.catInfo }
}

export default connect(mapStateToProps, { getCatCourses, getAllCourses, deleteCourseFromCat })(CategoryInfo);