import React from 'react';
import { connect } from 'react-redux';
import { getAllTeachers, addNewCourse } from "../../../../_actions/managerActions";
import Modal from "../../../modal/Modal";
import {add, loading} from "../../../../assets/icons";
import Select from "react-select";

class AddCourseModal extends React.Component {

    state = { loading: false, name: '', selectedTeacher: null, error: false }

    async componentDidMount() {
        this.setState({loading: true})
        await this.props.getAllTeachers(this.props.token);
        this.setState({loading: false})
    }

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

    handleSelectTeacher = selectedTeacher => {
        this.setState({ selectedTeacher });
    };

    change = (name) => {
        this.setState({ name })
    }

    onSubmit = () => {
        if (this.state.name === '') this.setState({ error: true })
        else {
            const formValues = { shortname: this.state.name}
            if (this.state.selectedTeacher) formValues.teacherId = this.state.selectedTeacher.value
            this.props.addNewCourse(this.props.token, formValues);
            this.props.onAddCancel()
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Modal cancel={this.props.onAddCancel}>
                    <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-500 px-4 py-16 flex flex-col justify-center items-center addCourse">
                        {loading("w-12 text-grayish")}
                    </div>
                </Modal>
            );
        }
        return (
            <Modal cancel={this.props.onAddCancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-500 px-4 py-16 flex flex-col justify-center items-end addCourse">
                    <span className="text-xl font-vr text-white my-4">اضافه کردن یک درس جدید</span>
                    <input
                        className={`w-2/3 mb-4 px-4 py-2 font-vb focus:outline-none focus:shadow-outline rounded-xl ${this.state.error ? 'border-2 border-red-600' : 'border-2 border-transparent'}`}
                        type="text"
                        value={this.state.name}
                        onChange={e => this.change(e.target.value)}
                        placeholder="نام..."
                        dir="rtl"
                    />
                    <div className="w-full flex flex-row-reverse justify-start">
                        <Select
                            className="w-2/3"
                            onChange={this.handleSelectTeacher}
                            options={this.renderSelectableTeachers()}
                        />
                        <div onClick={this.onSubmit} className="cursor-pointer">
                            {add("w-10 text-white mx-2")}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return { token: state.auth.userInfo.token, teachers: state.managerData.teachers }
}

export default connect(mapStateToProps, { getAllTeachers, addNewCourse })(AddCourseModal);