import React from 'react';
import { connect } from 'react-redux';
import {add, bookInfo, clear, loading} from "../../../../assets/icons";
import { getAllTeachers, editCourse, deleteCourse } from "../../../../actions";
import Select from "react-select";
import history from "../../../../history";
import Modal from "../../../Modal";

class ShowCourse extends React.Component {

    state = {
        name: '',
        selectedTeacher: null,
        showDeleteConfirm: false,
        delCourseLoading: false,
        editLoading: false
    }

    componentDidMount() {

        if (!this.props.course)
            history.push("/a/dashboard");
        else {
            this.props.getAllTeachers(this.props.auth.token);
            this.setState({ name: this.props.course.shortname })

            const teacher = this.props.teachers.find(el => el.id ===  this.props.course.teacherId)
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

    deleteCourse = async () => {
        this.setState({ delCourseLoading: true })
        await this.props.deleteCourse(this.props.auth.token, this.props.course.id);
        this.setState({ delCourseLoading: false, showDeleteConfirm: false })
    }

    showConfirm = () => {
        this.setState({ showDeleteConfirm: true })
    }

    onCancelDeleteCourse = () => {
        this.setState({ showDeleteConfirm: false })
    }

    save = async () => {
        let values = {id: this.props.course.id, shortname: this.state.name};
        if (this.state.selectedTeacher != null) {
            values.teacherId = this.state.selectedTeacher.value;
        } else {
            values.teacherId = this.props.course.teacherId
        }

        this.setState({ editLoading: true })
        await this.props.editCourse(this.props.auth.token, values);
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
                {this.state.showDeleteConfirm ?
                    <Modal cancel={this.onCancelDeleteCourse}>
                        <div onClick={(e) => e.stopPropagation()} className="md:w-1/3 w-5/6 p-8 flex flex-col items-center bg-white font-vb">
                            <span className="py-2 text-center">آیا از حذف کامل این درس مطمئن هستید؟</span>
                            <div className="flex md:flex-row flex-col">
                                <button
                                    onClick={this.onCancelDeleteCourse}
                                    className="px-8 py-2 mx-2 my-2 text-red-600 border-2 border-red-600 rounded-lg focus:outline-none"
                                >خیر</button>
                                <button
                                    onClick={() => this.deleteCourse()}
                                    className="px-8 py-2 mx-2 my-2 text-white bg-red-600 rounded-lg focus:outline-none"
                                >بله</button>
                            </div>
                        </div>
                    </Modal>
                    : null}
                <div className="w-5/6 max-w-600 bg-white p-12 flex flex-col justify-start items-center">
                    {bookInfo("w-24 h-24 text-dark-green")}
                    <div className="w-full flex my-8 md:flex-row-reverse flex-col justify-center items-center">
                        <span className="mx-2 text-xl text-blueish font-vb">نام درس</span>
                        <input
                            dir="rtl"
                            className="border-golden border-2 md:w-1/2 w-5/6 px-2 py-1 focus:outline-none focus:shadow-outline"
                            type="text"
                            value={this.state.name}
                            onChange={(e) => this.handleChange(e.target.value)}
                        />
                    </div>
                    <div className="w-full flex my-8 md:flex-row-reverse flex-col justify-center items-center">
                        <span className="mx-2 text-xl text-blueish font-vb">نام معلم</span>
                        <Select
                            className="md:w-1/2 w-5/6"
                            value={this.state.selectedTeacher}
                            onChange={this.handleSelectTeacher}
                            options={this.renderSelectableTeachers()}
                            isSearchable
                            placeholder="معلم"
                        />
                    </div>
                    <div className="w-full flex md:flex-row flex-col justify-center items-center">
                        <button onClick={this.save} className="px-8 py-2 mx-2 my-2 rounded-lg font-vb text-white bg-blueish">
                            {this.state.editLoading ? loading("w-6 text-white") : 'ذخیره'}
                        </button>
                        <button onClick={() => history.push("/a/dashboard")} className="px-8 py-2 mx-2 my-2 rounded-lg font-vb text-blueish border-2 border-blueish">
                            لغو
                        </button>
                        {this.state.delCourseLoading ?
                        loading("w-10 text-red-600")
                        :
                            <button onClick={this.showConfirm} className="px-8 py-2 mx-2 my-2   rounded-lg font-vb text-white bg-red-500">
                                حذف درس
                            </button>}
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

export default connect(mapStateToProps, { getAllTeachers, editCourse, deleteCourse })(ShowCourse);