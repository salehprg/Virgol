import React from "react";
import { getAllTeachers, addNewTeacher, fadeError, deleteTeacher } from "../../../../actions";
import {
    addPerson,
    clear, edit,
    errorOutline, excel,
    loading,
    remove
} from "../../../../assets/icons";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import Modal from "../../../Modal";
import history from "../../../../history";
import ReactTooltip from "react-tooltip";

class Teachers extends React.Component {

    state = {
        query: '',
        addTeacherState: null,
        showTeacherCourses: false,
        excel: null,
        renderAddTeacherModal: false
    }

    componentDidMount() {
        this.props.getAllTeachers(this.props.auth.token);
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
                    if (teacher.firstName.includes(this.state.query) || teacher.lastName.includes(this.state.query)) {
                        return (
                            <tr key={teacher.id}>
                                <td className="py-2">{teacher.firstName}</td>
                                <td className="py-2">{teacher.lastName}</td>
                                <td className="py-2">{teacher.melliCode}</td>
                                <td className="py-2">{teacher.phoneNumber}</td>
                                <td className="flex flex-col items-center py-2">
                                    <div className="flex flex-row justify-center">
                                        <div onClick={() => history.push(`/teacher/${teacher.id}`)} data-tip="ویرایش">
                                            {edit("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")}
                                        </div>
                                    </div>
                                </td>
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

    renderAddTeacher = () => {
        this.setState({ renderAddTeacherModal: true })
    }

    onCancelAdd = () => {
        this.setState({ renderAddTeacherModal: false })
    }

    handleSearch = query => {
        this.setState({ query })
    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center justify-end">
                <ReactTooltip />
                {this.state.renderAddTeacherModal ?
                    <Modal cancel={this.onCancelAdd}>
                        <div onClick={(e) => e.stopPropagation()} className="lg:w-3/5 md:w-4/5 w-5/6 py-16 px-4 relative flex md:flex-row  flex-col items-center justify-center bg-white font-vb">
                            <div onClick={this.onCancelAdd} className="absolute top-0 right-0">
                                {clear("w-6 h-8 text-black cursor-pointer")}
                            </div>
                            <div onClick={() => history.push("/addTeacher")} className="flex md:flex-col flex-row md:h-64 h-32 py-4 px-2 justify-center items-center md:w-1/4 w-5/6 md:mx-8 mx-0 md:my-0 my-4 border-green-800 border-4 cursor-pointer transform duration-200 hover:scale-110">
                                {addPerson("w-1/2 text-green-800")}
                                <span className="text-2xl text-center text-green-800 mt-4">افزودن به صورت دستی</span>
                            </div>
                            <div onClick={() => history.push("/addTeacherByExcel")} className="flex md:flex-col flex-row md:h-64 h-32 py-4 px-2 justify-center items-center md:w-1/4 w-5/6 md:mx-8 mx-0 md:my-0 my-4 border-green-800 border-4 cursor-pointer transform duration-200 hover:scale-110">
                                {excel("w-1/2 text-green-800")}
                                <span className="text-2xl text-center text-green-800 mt-4">افزودن با فایل اکسل</span>
                            </div>
                        </div>
                    </Modal>
                    : null}
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
                            onClick={this.renderAddTeacher}
                            className="mx-8 px-8 py-2 rounded-lg border-2 border-blueish font-vb text-blueish focus:outline-none focus:shadow-outline hover:bg-blueish hover:text-white">
                            افزودن معلم
                        </button>
                    </div>
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