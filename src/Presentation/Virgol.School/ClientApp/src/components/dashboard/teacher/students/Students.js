import React from "react";
import { getAllStudents, addNewTeacher, fadeError, deleteTeacher } from "../../../../actions";
import {
    addPerson,
    clear, edit,
    errorOutline, excel,
    loading
} from "../../../../assets/icons";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import Modal from "../../../Modal";
import history from "../../../../history";
import ReactTooltip from "react-tooltip";

class Students extends React.Component {

    state = {
        query: '',
        addTeacherState: null,
        showTeacherCourses: false,
        excel: null,
        renderAddTeacherModal: false
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
                    if (student.firstName.includes(this.state.query) || student.lastName.includes(this.state.query)) {
                        return (
                            <tr key={student.id}>
                                <td className="py-2">{student.firstName}</td>
                                <td className="py-2">{student.lastName}</td>
                                <td className="py-2">{student.melliCode}</td>
                                <td className="py-2">{student.phoneNumber}</td>
                            </tr>
                        );
                    }
                })

                return (
                    <table dir="rtl" className="table-auto w-5/6 text-center">
                        <thead>
                        <tr className="border-b-2 border-blueish">
                            <th className="px-8 py-2">نام</th>
                            <th className="px-8 py-2">نام خانوادگی</th>
                            <th className="px-8">کد ملی</th>
                            <th className="px-8">شماره همراه</th>
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

    handleSearch = query => {
        this.setState({ query })
    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center justify-end">
                <ReactTooltip />
                <div className="w-11/12 max-h-screen md:mb-12 mb-0 md:order-12 order-1 flex flex-col items-end">
                    <div className="w-full mb-2 flex flex-row-reverse justify-start items-center">
                        <input
                            className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="جست و جو"
                            value={this.state.query}
                            onChange={(e) => this.handleSearch(e.target.value)}
                        />
                        <button
                            onClick={() => history.push('/addStudents')}
                            className="mx-8 px-8 py-2 rounded-lg border-2 border-blueish font-vb text-blueish focus:outline-none focus:shadow-outline hover:bg-blueish hover:text-white">
                            افزودن دانش آموز
                        </button>
                    </div>
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
    form: 'addTeacher',
    validate
})(Students);

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        students: state.adminData.students,
        isThereError: state.error.isThereError,
        errorMessage: state.error.errorMessage,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getAllStudents, addNewTeacher, fadeError, deleteTeacher })(formWrapped);