import React from "react";
import Add from "../../../../field/Add";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {reduxForm, Field} from 'redux-form';
import history from "../../../../../history";
import Fieldish from '../../../../field/Fieldish';
import { check_circle } from "../../../../../assets/icons";
import ManagerGenerated from "./ManagerGenerated";
import {CreateSchool} from "../../../../../_actions/schoolActions";

class AddSchool extends React.Component {

    state = { showManagerInfo: true }

    renderInputs = ({ input, meta, type, placeholder , extra }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra={extra + " my-4"}
            />
        );
    }

    onSubmit = async (formValues) => {
        console.log(formValues);
        await this.props.CreateSchool(this.props.user.token , formValues)
        this.setState({showManagerInfo : false})
    }

    render() {
        return (
            <Add 
                onCancel={() => history.push('/a/schools')}
                title="افزودن مدرسه"
            >
                {this.state.showManagerInfo || !this.props.managerInfo ? 
                <form className="w-full" style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Field
                    name="schoolName"
                    type="text"
                    placeholder="نام مدرسه"
                    extra={"w-full my-4 mx-2"}
                    component={this.renderInputs}
                />
                <Field
                    name="schoolIdNumber"
                    type="text"
                    placeholder="کد مدرسه"
                    extra={"w-full my-4 mx-2"}
                    component={this.renderInputs}
                />
                <Field
                    name="firstName"
                    type="text"
                    placeholder="نام مدیر"
                    extra={"w-40 my-4"}
                    component={this.renderInputs}
                />
                <Field
                    name="lastName"
                    type="text"
                    extra={"w-40 my-4"}
                    placeholder="نام خانوادگی مدیر"
                    component={this.renderInputs}
                />
                <Field
                    name="managerPhoneNumber"
                    type="text"
                    extra={"w-full my-4 mx-2"}
                    placeholder="شماره همراه مدیر"
                    component={this.renderInputs}
                />
                <Field
                    name="melliCode"
                    type="text"
                    placeholder="کدملی مدیر"
                    extra={"w-full my-4 mx-2"}
                    component={this.renderInputs}
                />
                <Field
                    name="personalIdNumber"
                    type="text"
                    placeholder="کد پرسنلی مدیر"
                    extra={"w-full my-4 mx-2"}
                    component={this.renderInputs}
                />

                <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">افزودن</button>
            </form> 
                : 
                <div className="p-6 border-2 border-dashed border-dark-blue">
                    {check_circle('w-1/4 mx-auto text-greenish')}
                    <p className="text-center text-greenish">
                        مدرسه جدید با موفقیت ایجاد شد. مدیر مدرسه میتواند با نام کاربری و گذرواژه زیر وارد پنل مدیریت مدرسه شود
                    </p>
                    <ManagerGenerated 
                        title="نام کاربری"
                        value={this.props.managerInfo.melliCode}
                    />
                    <ManagerGenerated 
                        title="گدرواژه"
                        value={this.props.managerInfo.password}
                    />
                    <button type="button" className="w-full px-4 py-2 border-2 border-sky-blue text-sky-blue" onClick={() => history.push(`/school/${this.props.managerInfo.schoolId}`)}>افزودن مقاطع، رشته ها و دروس</button>
                </div>
                }
            </Add>
        );
    }

}

const validate = (formValues) => {

    const errors = {}

    if (!formValues.schoolName) errors.schoolName = true
    if (!formValues.schoolIdNumber) errors.schoolIdNumber = true
    if (!formValues.firstName) errors.firstName = true
    if (!formValues.lastName) errors.lastName = true
    if (!formValues.melliCode) errors.melliCode = true
    if (!formValues.personalIdNumber) errors.personalIdNumber = true

    return errors;

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , managerInfo: state.schoolData.CreateSchool}
}

const formWrapped = reduxForm({
    form: 'schoolInfo',
    validate
}, mapStateToProps)(AddSchool)

export default connect(mapStateToProps,{CreateSchool})(formWrapped);