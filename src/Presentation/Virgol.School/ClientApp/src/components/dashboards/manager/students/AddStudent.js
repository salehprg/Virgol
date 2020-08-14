import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {AddNewStudent } from "../../../../_actions/managerActions"
import { validator } from '../../../../assets/validator'

class AddStudent extends React.Component {

    renderInputs = ({ input, meta, type, placeholder }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra="w-full my-4"
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
                        />
                        <Field
                            name="lastName"
                            type="text"
                            placeholder="نام خانوادگی"
                            component={this.renderInputs}
                        />
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder="کد ملی"
                            component={this.renderInputs}
                        />
                        <Field
                            name="fatherName"
                            type="text"
                            placeholder="نام پدر"
                            component={this.renderInputs}
                        />
                    
                        <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">ذخیره</button>
                    </form>
                </Add>
        );
    }

}

const validate = formValues => {
    const errors = {}

    const { firstName, lastName, melliCode, fatherName } = formValues
    if (!firstName || !validator.checkPersian(firstName)) errors.firstName = true
    if (!lastName || !validator.checkPersian(lastName)) errors.lastName = true
    if (!melliCode || !validator.checkMelliCode(melliCode)) errors.melliCode = true
    if (!fatherName || !validator.checkPersian(fatherName)) errors.fatherName = true
    
    return errors
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