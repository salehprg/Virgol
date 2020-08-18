import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field, formValues } from 'redux-form'
import { connect } from 'react-redux';
import {addNewTeacher } from "../../../../_actions/managerActions"
import {validator} from '../../../../assets/validator'
import protectedManager from "../../../protectedRoutes/protectedManager";

class AddTeacher extends React.Component {

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

        // data.userDetail = {
        //     latinLastname : formValues.latinLastname,
        //     latinFirstname : formValues.latinFirstname
        // }
      
        await this.props.addNewTeacher(this.props.user.token , formValues)
    }

    render() {
        return (
            <div>
                <Add
                    onCancel={() => history.push('/m/teachers')}
                    title={"اطلاعات معلم"}
                >
                    <form className="w-full" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <Field
                            name="firstName"
                            type="text"
                            placeholder="نام"
                            component={this.renderInputs}
                            extra={"my-4 mx-2"}
                        />
                        <Field
                            name="lastName"
                            type="text"
                            placeholder="نام خانوادگی"
                            component={this.renderInputs}
                            extra={"my-4 mx-2"}
                        />
                        {/* <Field
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
                        /> */}
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder="کد ملی"
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />

                        <Field
                            name="phoneNumber"
                            type="text"
                            placeholder="تلفن همراه"
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />

                        <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">ذخیره</button>
                    </form>
                </Add>
            </div>
        );
    }

}

const validate = formValues => {
    const errors = {}

    if (!formValues.firstName || !validator.checkPersian(formValues.firstName)) errors.firstName = true
    if (!formValues.lastName || !validator.checkPersian(formValues.lastName)) errors.lastName = true
    if (!formValues.melliCode  || !validator.checkMelliCode(formValues.melliCode)) errors.melliCode = true
    if (!formValues.phoneNumber  || !validator.checkPhoneNumber(formValues.phoneNumber)) errors.phoneNumber = true

    return errors;
}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo 
    }
}

const formWrapped = reduxForm({
    form: 'addTeacher',
    validate
})(AddTeacher)

const authWrapped = protectedManager(formWrapped)

export default connect(mapStateToProps , {addNewTeacher})(authWrapped);