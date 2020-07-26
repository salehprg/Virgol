import React from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm} from "redux-form";
import { deleteTeacher, editTeacher } from "../../../../_actions/managerActions";
import {glasses, loading} from "../../../../assets/icons";
import {Link} from "react-router-dom";
import Modal from "../../../modal/Modal";
import history from "../../../../history";

class TeacherInfo extends React.Component {

    state = { showDeleteConfirm: false, delLoading: false, delEdit: false, editLoading: false }

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

    onSubmit = async (formValues) => {
        formValues.id = parseInt(this.props.match.params.id);
        this.setState({ editLoading: true })
        await this.props.editTeacher(this.props.token, formValues);
        this.setState({ editLoading: false })
    }

    showConfirm = () => {
        this.setState({ showDeleteConfirm: true })
    }

    onCancelDelete = () => {
        this.setState({ showDeleteConfirm: false })
    }

    onDeleteTeacher = async () => {
        this.setState({ delLoading: true })
        await this.props.deleteTeacher(this.props.token, this.props.match.params.id);
        this.setState({ showDeleteConfirm: false, delLoading: false })
    }

    render() {
        return (
            <div className="w-screen min-h-screen teacherInfoBg flex justify-center items-center">
                {this.state.showDeleteConfirm ?
                    <Modal cancel={this.onCancelDelete}>
                        <div onClick={(e) => e.stopPropagation()} className="md:w-1/3 w-5/6 p-8 flex flex-col items-center bg-white font-vb">
                            <span className="py-2 text-center">آیا از حذف کامل این معلم مطمئن هستید؟</span>
                            <div className="flex md:flex-row flex-col">
                                <button
                                    onClick={this.onCancelDelete}
                                    className="px-8 py-2 mx-2 my-2 text-red-600 border-2 border-red-600 rounded-lg focus:outline-none"
                                >خیر</button>
                                <button
                                    onClick={() => this.onDeleteTeacher()}
                                    className="px-8 py-2 mx-2 my-2 text-white bg-red-600 rounded-lg focus:outline-none"
                                >بله</button>
                            </div>
                        </div>
                    </Modal>
                    : null}
                <div className="max-w-1000 relative w-full bg-white flex md:flex-row flex-col justify-center items-stretch">
                    <div className="md:w-1/2 w-full bg-blueish flex flex-col justify-center items-center">
                        {glasses("w-48 h-48 text-white")}
                    </div>
                    <div className="md:w-1/2 w-full bg-white py-16 flex flex-col justify-center items-center">
                        <form className="w-3/5 text-center" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                            <Field
                                name="firstName"
                                placeholder="نام"
                                component={this.renderFormInputs}
                                defaultValue="weewv"
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
                            <button type="submit" className="bg-golden flex justify-center items-center my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg">
                                {this.state.editLoading ? loading("w-6 text-dark-green") : 'ذخیره'}
                            </button>
                            <div className="w-full flex flex-row justify-between items-center">
                                <button type="button" onClick={() => this.showConfirm()} className="w-2/5 py-2 text-center flex justify-center items-center rounded-lg text-white font-vb bg-red-600">
                                    {this.state.delLoading ? loading("w-6 text-white") : 'حذف معلم'}
                                </button>
                                <Link className="w-2/5 py-2 text-grayish text-center rounded-lg font-vb border-2 border-grayish" to="/m/dashboard">لغو</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

}

const validate = formValues => {
    const errors = {}

    if (!formValues.firstName) errors.firstName = true
    if (!formValues.lastName) errors.lastName = true
    if (!formValues.melliCode) errors.melliCode = true
    if (!formValues.phoneNumber) errors.phoneNumber = true

    return errors;
}

const mapStateToProps = (state, myProps) => {
    const teacher = state.managerData.teachers.find(el => el.id === parseInt(myProps.match.params.id));
    return {
        token: state.auth.userInfo.token,
        initialValues: {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            melliCode: teacher.melliCode,
            phoneNumber: teacher.phoneNumber
        }
    }
}

const formWrapped = reduxForm({
    form: 'editTeacher',
    validate
}, mapStateToProps)(TeacherInfo);

export default connect(mapStateToProps, { deleteTeacher, editTeacher })(formWrapped);