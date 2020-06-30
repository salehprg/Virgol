import React from "react";
import Select from 'react-select';
import { getAllTeachers } from "../../../actions";
import {book, edit, errorOutline, loading, remove} from "../../../assets/icons";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";

class Teachers extends React.Component {

    state = { selectedCourses: null, showTeacherCourses: false }

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
                const teacherCards = teachers.map((category) => {
                    return (
                        <tr key={category}>
                            <td className="py-2"></td>
                            <td className="py-2"></td>
                            <td className="py-2"></td>
                            <td className="py-2 flex flex-col items-center">
                                <div onClick={(e) => this.setState({showTeacherCourses : !this.state.showTeacherCourses})}>{book("w-8 h-8 text-bluish")}</div>
                                <div className={`transform origin-top duration-300 ${!this.state.showTeacherCourses ? 'scale-y-0' : 'scale-y-100 flex flex-col'}`}>
                                    <span className={`${!this.state.showTeacherCourses ? 'hidden' : 'block'}`}></span>
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
                            <th className="px-8">دروس مورد تدریس</th>
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

    onAddBase = () => {

    }

    renderCourses = () => {
        return [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' },
            { value: 'vanilla1', label: 'Vanilla1' },
            { value: 'vanilla2', label: 'Vanilla2' },
            { value: 'vanilla3', label: 'Vanilla3' },
            { value: 'vanilla4', label: 'Vanilla4' },
            { value: 'vanilla5', label: 'Vanilla5' },
            { value: 'vanilla6', label: 'Vanilla6' },
            { value: 'vanilla7', label: 'Vanilla7' },
            { value: 'vanilla8', label: 'Vanilla8' },
            { value: 'vanilla9', label: 'Vanilla9' },
            { value: 'vanilla10', label: 'Vanilla10' },
            { value: 'vanilla11', label: 'Vanilla11' },
            { value: 'vanilla12', label: 'Vanilla12' },
            { value: 'vanilla13', label: 'Vanilla13' },
        ];
    }

    handleChange = selectedCourses => {
        this.setState({ selectedCourses });
    };

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center justify-evenly">
                <div className="md:w-1/4 w-5/6 md:order-1 order-2 flex flex-col items-end">
                    <input
                        className="md:w-1/3 w-1/2 invisible mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">افزودن معلم</span>
                        <form className="w-3/4 flex flex-col text-center" onSubmit={this.props.handleSubmit(this.onAddBase)}>
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
                            <Select
                                value={this.state.selectedCourses}
                                onChange={this.handleChange}
                                options={this.renderCourses()}
                                isMulti={true}
                                isSearchabel={true}
                                placeholder="دروس"
                            />
                            <button className="bg-golden my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg">افزودن</button>
                        </form>
                    </div>
                </div>
                <div className="md:w-1/2 w-5/6 max-h-screen mb-12 md:order-12 order-1 flex flex-col items-end">
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
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getAllTeachers })(formWrapped);