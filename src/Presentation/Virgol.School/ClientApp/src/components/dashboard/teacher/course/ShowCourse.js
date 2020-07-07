import React from 'react';
import { connect } from 'react-redux';
import {bookInfo, loading} from "../../../../assets/icons";
import { getAllTeachers, editCourse, deleteCatCourse } from "../../../../actions";
import Select from "react-select";
import history from "../../../../history";

class ShowCourse extends React.Component {

    state = { name: '', selectedTeacher: null }

    componentDidMount() {
        this.props.getAllTeachers(this.props.auth.token);
        this.setState({ name: this.props.course.shortname })

        const teacher = this.props.teachers.find(el => el.id === 32)
        if (teacher) {
            const initial = [
                {
                    value: teacher.id,
                    label: teacher.firstName + " " + teacher.lastName
                }
            ]
            this.setState({ selectedTeacher: initial })
        }
    }

    handleChange = (name) => {
        this.setState({ name })
    }

    handleSelectTeacher = selectedTeacher => {
        this.setState({ selectedTeacher });
    };

    renderSelectableTeachers = () => {
        let options = []

        this.props.teachers.map(teacher => {
            options.push({
                value: teacher.id,
                label: teacher.firstName + " " + teacher.lastName
            });
        })

        return options;
    }

    deleteCourse = () => {
        const values = {
            id: this.props.course.id
        }
        this.props.deleteCatCourse(this.props.auth.token, values);
        history.push("/a/dashboard");
    }

    save = () => {
        let modified = false;
        let values = { id: this.props.course.id };
        if (this.state.name !== this.props.course.shortname) {
            values.shortname = this.state.name;
            modified = true
        }
        if (this.state.selectedTeacher === this.props.course.teacherId) {
            values.teacherId = this.state.selectedTeacher;
            modified = true
        }

        if (modified) {
            this.props.editCourse(this.props.auth.token, values);
            history.push("/a/dashboard");
        }
    }

    render() {
        if (!this.props.teachers || !this.props.course) {
            return (
                <div className="w-screen h-screen flex justify-center items-center">
                    {loading("w-12 h-12 text-dark-green")}
                </div>
            );
        }

        return (
            <div className="w-screen min-h-screen bg-dark-green flex justify-center items-center">
                <div className="w-5/6 max-w-600 bg-white p-12 flex flex-col justify-start items-center">
                    {bookInfo("w-24 h-24 text-dark-green")}
                    <div className="w-full flex my-8 flex-row-reverse justify-center items-center">
                        <span className="mx-2 text-xl text-blueish font-vb">نام درس</span>
                        <input
                            dir="rtl"
                            className="border-golden border-2 w-1/2 px-2 py-1 focus:outline-none focus:shadow-outline"
                            type="text"
                            value={this.state.name}
                            onChange={(e) => this.handleChange(e.target.value)}
                        />
                    </div>
                    <div className="w-full flex my-8 flex-row-reverse justify-center items-center">
                        <span className="mx-2 text-xl text-blueish font-vb">نام معلم</span>
                        <Select
                            className="w-1/2"
                            value={this.state.selectedTeacher}
                            onChange={this.handleSelectTeacher}
                            options={this.renderSelectableTeachers()}
                            isSearchable
                            placeholder="معلم"
                        />
                    </div>
                    <div className="w-full flex flex-row justify-center items-center">
                        <button onClick={this.save} className="px-8 py-2 mx-2 rounded-lg font-vb text-white bg-blueish">ذخیره</button>
                        <button onClick={() => history.push("/a/dashboard")} className="px-8 py-2 mx-2 rounded-lg font-vb text-blueish border-2 border-blueish">
                            لغو
                        </button>
                        <button onClick={this.deleteCourse} className="px-8 py-2 mx-2 rounded-lg font-vb text-white bg-red-500">
                            حذف درس
                        </button>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state, myProps) => {
    return {
        auth: state.auth.userInfo,
        course: state.adminData.courses.find(el => el.id === parseInt(myProps.match.params.id)),
        teachers: state.adminData.teachers
    }
}

export default connect(mapStateToProps, { getAllTeachers, editCourse, deleteCatCourse })(ShowCourse);