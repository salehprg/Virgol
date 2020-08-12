import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {AddNewStudent } from "../../../../_actions/managerActions"


class AddStudent extends React.Component {

    renderInputs = ({ input, meta, type, placeholder , extra }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra={extra}
            />
        );
    }

    onSubmit = async (formValues) => {
        
        let data = formValues;

        data.userDetail = {
            latinLastname : formValues.latinLastname,
            latinFirstname : formValues.latinFirstname,
            fatherName : formValues.fatherName,
            fatherPhoneNumber : formValues.fatherPhoneNumber
        }

        console.log(data)
        
        await this.props.AddNewStudent(this.props.user.token , data)
    }

    render() {
        return (
            <div>
                <Add
                    onCancel={() => history.push('/m/students')}
                    title={"اطلاعات دانش آموز"}
                >
                    <form className="w-full" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                    <Field
                            name="firstName"
                            type="text"
                            placeholder="نام"
                            component={this.renderInputs}
                            extra={"w-40 my-4 mx-2"}
                        />
                        <Field
                            name="lastName"
                            type="text"
                            placeholder="نام خانوادگی"
                            component={this.renderInputs}
                            extra={"w-40 my-4"}
                        />
                        <Field
                            name="latinFirstname"
                            type="text"
                            placeholder="نام لاتین"
                            component={this.renderInputs}
                            extra={"w-40 my-4 mx-2"}
                        />
                        <Field
                            name="latinLastname"
                            type="text"
                            placeholder="نام خانوادگی لاتین"
                            component={this.renderInputs}
                            extra={"w-40 my-4"}
                        />
                        <Field
                            name="phoneNumber"
                            type="text"
                            placeholder="شماره همراه"
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder="کد ملی"
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />
                        <Field
                            name="fatherName"
                            type="text"
                            placeholder="نام پدر"
                            component={this.renderInputs}
                            extra={"w-40 my-4"}
                        />
                        <Field
                            name="fatherPhoneNumber"
                            type="text"
                            placeholder="شماره همراه پدر"
                            component={this.renderInputs}
                            extra={"w-40 my-4 mx-2"}
                        />
                        <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">ذخیره</button>
                    </form>
                </Add>
            </div>
        );
    }

}

const mapStateToProps = state => {
    console.log(state)
    return {
        user: state.auth.userInfo 
    }
}

const formWrapped = reduxForm({
    form: 'addStudent'
})(AddStudent)

export default connect(mapStateToProps , {AddNewStudent })(formWrapped);