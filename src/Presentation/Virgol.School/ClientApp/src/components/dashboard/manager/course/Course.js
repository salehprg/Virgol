import React from "react";
import { getAllCourses, getAllTeachers, addNewCourse ,fadeError} from "../../../../_actions/managerActions";
import {loading, add, clear} from "../../../../assets/icons";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import Modal from "../../../modal/Modal";
import CoursesList from "./CoursesList";
import Pagination from "../../pagination/Pagination";
import Select from "react-select";

class Course extends React.Component {

    state = {
        query: '',
        renderModal: false,
        selectedTeacher: null,
        currentPage: 1,
        cardsPerPage: 15,
        loading: false
    }

    componentDidMount() {
        this.props.getAllCourses(this.props.auth.token);
        this.props.getAllTeachers(this.props.auth.token);
    }

    renderAddCourseFormFields = ({ input, meta, placeholder }) => {
        return (
            <input
                {...input}
                dir="rtl"
                className={`w-1/2 px-2 py-2  placeholder-grayish focus:outline-none focus:shadow-outline border-2  ${meta.error && meta.touched ? 'border-red-600' : 'border-white'}`}
                type="text"
                placeholder={placeholder}
            />
        );
    }

    renderAddCourseModal = (id) => {
        this.setState({ renderModal: true })
    }

    onAddCourse = async (formValues) => {
        this.setState({ loading: true })
        if (this.state.selectedTeacher !== null) formValues.teacherId = this.state.selectedTeacher.value
        await this.props.addNewCourse(this.props.auth.token, formValues);
        // this.props.getAllCourses(this.props.auth.token);
        this.setState({renderModal: false, loading: false})
    }

    onCancelAdd = () => {
        this.setState({ renderModal: false, deleteHolderId: null })
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
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

    render() {
        if (!this.props.courses || !this.props.teachers ) {
            return (
                <div className="h-full flex justify-center items-center">
                    {loading("w-16 h-16 text-blueish")}
                </div>
            );
        }

        const indexOfLastPost = this.state.currentPage * this.state.cardsPerPage;
        const indexOfFirstPost = indexOfLastPost - this.state.cardsPerPage;
        const currentCards = this.props.courses.slice(indexOfFirstPost, indexOfLastPost);

        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center md:justify-end">
                {this.state.renderModal ?
                    <Modal cancel={this.onCancelAdd}>
                        <div onClick={(e) => e.stopPropagation()} className="md:w-1/3 w-5/6 py-16 px-4 relative flex flex-col items-end addCourseInCourses bg-cover font-vb">
                            <div onClick={this.onCancelAdd} className="absolute top-0">
                                {clear("w-6 h-8 text-white cursor-pointer")}
                            </div>
                            <span className="text-dark-green my-4 text-2xl">اضافه کردن درس</span>
                            <form onSubmit={this.props.handleSubmit(this.onAddCourse)} className="w-full flex flex-col justify-start items-end" >
                                <Field
                                    name="shortname"
                                    placeholder="نام درس"
                                    component={this.renderAddCourseFormFields}
                                />
                                <div className="w-full my-4 flex flex-row-reverse justify-start">
                                    <Select
                                        className="w-2/3 ml-3"
                                        value={this.state.selectedTeacher}
                                        onChange={this.handleSelectTeacher}
                                        options={this.renderSelectableTeachers()}
                                        isSearchable
                                        placeholder="معلم"
                                    />
                                    <button type="submit" className="focus:outline-none">
                                        {this.state.loading ?
                                            loading("w-8 h-8 mx-2 text-dark-green")
                                        :
                                            add("w-8 h-8 mx-2 text-dark-green")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                    : null}
                <div className="w-full min-h-screen md:mb-12 mb-0 md:order-12 order-1 flex flex-col items-end">
                    <div className="w-full flex flex-row-reverse justify-start items-center">
                        <input
                            value={this.state.query}
                            onChange={(e) => this.setState({ query: e.target.value })}
                            className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="جست و جو"
                        />
                        <button
                            onClick={this.renderAddCourseModal}
                            className="mx-8 px-8 py-2 rounded-lg border-2 border-blueish font-vb text-blueish focus:outline-none focus:shadow-outline hover:bg-blueish hover:text-white">
                            افزودن درس
                        </button>
                    </div>
                    <CoursesList
                        courses={currentCards}
                        query={this.state.query}
                    />
                    <Pagination
                        cardsPerPage={this.state.cardsPerPage}
                        totalCards={this.props.courses.length}
                        paginate={this.paginate}
                        currentPage={this.state.currentPage}
                    />
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.shortname) errors.shortname = true;

    return errors;
}

const formWrapped = reduxForm({
    form: 'addCourse',
    validate
})(Course);

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        courses: state.managerData.courses,
        teachers: state.managerData.teachers,
        isThereError: state.error.isThereError,
        errorMessage: state.error.errorMessage,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getAllCourses, getAllTeachers, addNewCourse ,fadeError })(formWrapped);