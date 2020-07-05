import React from "react";
import Select from 'react-select';
import { getAllTeachers, addNewTeacher, fadeError, deleteTeacher } from "../../../actions";
import {book, edit, errorOutline, loading, remove} from "../../../assets/icons";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import AddPerson from "./AddPerson";
import Modal from "../../Modal";

class Teachers extends React.Component {

    state = {
        addTeacherState: null,
        showTeacherCourses: false,
        excel: null,
        renderModal: false,
        deleteHolderId: null
    }

    componentDidMount() {
        this.props.getAllTeachers(this.props.auth.token);
    }

    showModal = (id) => {
        this.setState({ renderModal: true, deleteHolderId: id })
    }

    onAcceptDelete = () => {
        this.props.deleteTeacher(this.props.auth.token, this.state.deleteHolderId);
        this.setState({ renderModal: false, deleteHolderId: null })
    }

    onCancelDelete = () => {
        this.setState({ renderModal: false, deleteHolderId: null })
    }

    renderTeachers = () => {

        const { teachers } = this.props;

        if (teachers !== null) {
            if (teachers.length === 0) {
                return (
                    <div className="w-full flex-grow flex flex-col justify-center items-center">
                        {errorOutline("w-24 h-24 text-blueish")}
                        <span className="text-xl mt-4 text-dark-blue">هیچ معلمی وجود ندارد</span>
                    </div>
                );
            } else {
                const teacherCards = teachers.map((teacher) => {
                    return (
                        <tr key={teacher.id}>
                            <td className="py-2">{teacher.firstName}</td>
                            <td className="py-2">{teacher.lastName}</td>
                            <td className="py-2">{teacher.melliCode}</td>
                            <td className="flex flex-col items-center py-2">
                                <div className="flex flex-row justify-center">
                                    <div onClick={() => this.showModal(teacher.id)} data-tip="حذف">
                                        {this.props.loadingComponent !== teacher.id ?
                                            remove("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")
                                            :
                                            loading("w-8 h-8 text-blueish")
                                        }
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                })

                return (
                    <table dir="rtl" className="table-auto w-5/6 text-center">
                        <thead>
                        <tr className="border-b-2 border-blueish">
                            <th className="px-8 py-2">نام</th>
                            <th className="px-8 py-2">نام خانوادگی</th>
                            <th className="px-8">کد ملی</th>
                            <th className="px-8"> </th>
                        </tr>
                        </thead>
                        <tbody>
                            {teacherCards}
                        </tbody>
                    </table>
                );
            }
        }

        return loading("w-16 h-16 text-blueish")

    }

    renderFormInputs = ({ input, meta, placeholder }) => {
        return (
            <div className={`flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
                <input
                    {...input}
                    dir="rtl"
                    className="w-full px-2 placeholder-grayish focus:outline-none"
                    type="text"
                    placeholder={placeholder}
                />
            </div>
        );
    }

    handleFileChange = (file) => {
        this.setState({ excel: file })
    }

    renderAddButton = () => {
        if (this.props.isThereLoading && this.props.loadingComponent === 'addNewTeacher') {
            return (
                <button className="bg-golden flex flex-col items-center my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg focus:outline-none">
                    {loading("w-8 h-8 text-dark-green")}
                </button>
            );
        }

        if (this.props.isThereError && this.props.errorMessage === 'add new teacher error') {
            setTimeout(() => {
                this.props.fadeError();
            }, 1000);
            return (
                <button className="bg-red-500 my-6 transition-all duration-200 font-vb text-xl text-white w-full py-2 rounded-lg focus:outline-none">
                    خطا
                </button>
            );
        }

        return (
            <button className="bg-golden my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg focus:outline-none">
                افزودن
            </button>
        );
    }

    onAddTeacher = (formValues) => {
        this.props.addNewTeacher(this.props.auth.token, formValues);
    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center justify-end">
                {this.state.renderModal ? <Modal accept={this.onAcceptDelete} cancel={this.onCancelDelete} /> : null}
                <div className="md:w-1/4 w-5/6 md:mx-4 mx-0 md:order-1 order-2 flex flex-col items-end">
                    <div className={`w-full md:mx-4 mx-0 flex flex-col items-end`}>
                        <input
                            className="md:w-1/3 w-1/2 invisible md:mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="جست و جو"
                        />
                        <div
                            onClick={() => this.setState({ addTeacherState: this.state.addTeacherState === 'manual' ? null : 'manual'})}
                            className="bg-white w-full flex flex-col py-2 cursor-pointer justify-start items-center overflow-hidden">
                            <span className="font-vb text-blueish text-center text-2xl mb-4">افزودن معلم به صورت دستی</span>
                            <form
                                className={`w-3/4 flex flex-col transition-height ${this.state.addTeacherState === 'manual' ? 'max-h-1000' : 'max-h-0'}`}
                                onSubmit={this.props.handleSubmit(this.onAddTeacher)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Field
                                    name="firstName"
                                    placeholder="نام"
                                    component={this.renderFormInputs}
                                />
                                <Field
                                    name="lastName"
                                    placeholder="نام خانوادگی"
                                    component={this.renderFormInputs}
                                />
                                <Field
                                    name="melliCode"
                                    placeholder="کد ملی"
                                    component={this.renderFormInputs}
                                />
                                <Field
                                    name="phoneNumber"
                                    placeholder="شماره همراه"
                                    component={this.renderFormInputs}
                                />
                                {this.renderAddButton()}
                            </form>
                        </div>
                    </div>
                    <div className="w-full md:mx-4 mx-0 md:mb-0 mb-4 flex flex-col items-center">
                        <AddPerson
                            handleFile={this.handleFileChange}
                        />
                    </div>
                </div>
                <div className="md:w-2/3 w-5/6 max-h-screen md:mb-12 mb-0 md:order-12 order-1 flex flex-col items-end">
                    <input
                        className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full min-h-75 flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">معلمان</span>
                        {this.renderTeachers()}
                    </div>
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.firstName) errors.firstName = true;
    if (!formValues.lastName) errors.lastName = true;
    if (!formValues.melliCode) errors.melliCode = true;
    if (!formValues.phoneNumber) errors.phoneNumber = true;

    return errors;
}

const formWrapped = reduxForm({
    form: 'addTeacher',
    validate
})(Teachers);

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        teachers: state.adminData.teachers,
        isThereError: state.error.isThereError,
        errorMessage: state.error.errorMessage,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getAllTeachers, addNewTeacher, fadeError, deleteTeacher })(formWrapped);