import React from "react";
import { getAllStudents, addBulkUser } from "../../../actions";
import {errorOutline, loading} from "../../../assets/icons";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import AddPerson from "./AddPerson";

class Students extends React.Component {

    state = {
        addStudentState: null,
        showTeacherCourses: false,
        excel: null
    }

    componentDidMount() {
        this.props.getAllStudents(this.props.auth.token);
    }

    renderStudents = () => {

        const { students } = this.props;

        if (students !== null) {
            if (students.length === 0) {
                return (
                    <div className="w-full flex-grow flex flex-col justify-center items-center">
                        {errorOutline("w-24 h-24 text-blueish")}
                        <span className="text-xl mt-4 text-dark-blue">هیچ دانش آموزی وجود ندارد</span>
                    </div>
                );
            } else {
                const studentCards = students.map((student) => {
                    return (
                        <tr key={student.id}>
                            <td className="py-2">{student.firstName}</td>
                            <td className="py-2">{student.lastName}</td>
                            <td className="py-2">{student.melliCode}</td>
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
                        </tr>
                        </thead>
                        <tbody>
                        {studentCards}
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

    onAddStudent = () => {

    }

    onAddBulkStudent = (e) => {
        e.preventDefault();
        this.props.addBulkUser(this.props.auth.token, this.state.excel);
    }

    renderAddBulkStatus = () => {
        if (this.props.isThereSuccess) {
            return (
                <span className={`text-center w-5/6 bg-green-300 px-2 py-1 transition-all duration-300 ${this.props.isThereSuccess ? 'opacity-100' : 'opacity-0'}`}>اپلود با موفقیت انجام شد. لیست دانش آموزان تا لحظاتی دیگر بروزرسانی میشود</span>
            );
        } else if (this.props.isThereError) {
            return (
                <span className={`text-center w-5/6 bg-red-300 px-2 py-1 transition-all duration-300 ${this.props.isThereError ? 'opacity-100' : 'opacity-0'}`}>خطایی رخ داد</span>
            );
        }
    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center justify-end">
                <div className="md:w-1/4 w-5/6 md:mx-4 mx-0 md:order-1 order-2 flex flex-col items-center">
                    <div className={`w-full md:mx-4 flex flex-col items-end`}>
                        <input
                            className="md:w-1/3 w-1/2 invisible mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="جست و جو"
                        />
                        <div
                            onClick={() => this.setState({ addStudentState: this.state.addStudentState === 'manual' ? null : 'manual'})}
                            className="bg-white w-full flex flex-col py-2 cursor-pointer justify-start items-center overflow-hidden">
                            <span className="font-vb text-blueish text-xl mb-4">افزودن دانش آموز به صورت دستی</span>
                            <form className={`w-3/4 flex flex-col transition-height ${this.state.addStudentState === 'manual' ? 'max-h-1000' : 'max-h-0'}`} onSubmit={this.props.handleSubmit(this.onAddStudent)}>
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
                                <button className="bg-golden my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg">افزودن</button>
                            </form>
                        </div>
                    </div>
                    <div className="w-full md:mx-4 mx-0 md:mb-0 mb-4 flex flex-col items-center">
                        <AddPerson
                            handleFile={this.handleFileChange}
                            onSubmit={this.onAddBulkStudent}
                        />
                    </div>
                    {this.renderAddBulkStatus()}
                </div>
                <div className="md:w-2/3 w-5/6 max-h-screen mb-12 md:order-12 order-1 flex flex-col items-end">
                    <input
                        className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full min-h-75 flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">دانش آموزان</span>
                        {this.renderStudents()}
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
    form: 'addStudent',
    validate
})(Students);

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        students: state.adminData.students,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent,
        isThereSuccess: state.success.isThereSuccess,
        successMessage: state.success.successMessage,
        isThereError: state.error.isThereError,
        errorMessage: state.error.errorMessage
    }
}

export default connect(mapStateToProps, { getAllStudents, addBulkUser })(formWrapped);