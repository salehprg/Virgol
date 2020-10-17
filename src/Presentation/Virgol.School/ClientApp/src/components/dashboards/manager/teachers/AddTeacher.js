import React from 'react';
import { withTranslation } from 'react-i18next';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field, formValues } from 'redux-form'
import { connect } from 'react-redux';
import {addNewTeacher } from "../../../../_actions/managerActions"
import {validator} from '../../../../assets/validator'
import protectedManager from "../../../protectedRoutes/protectedManager";

class AddTeacher extends React.Component {

    state = {selectedOption : "Male"}

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

    handleRadioBtnChng = (gender) =>{
        this.setState({selectedOption : gender});
    }

    onSubmit = async (formValues) => {
        
        let data = formValues;

        data.teacherDetail = {
            personalIdNUmber : formValues.personalIdNUmber
        }
        formValues.sexuality = (this.state.selectedOption === "Male" ? 1 : 0)

      
        await this.props.addNewTeacher(this.props.user.token , formValues)
    }

    render() {
        return (
            <div>
                <Add
                    onCancel={() => history.push('/m/teachers')}
                    title={this.props.t('teacherInfo')}
                >
                    <form className="w-full" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        {/*<div className="text-white">*/}
                        {/*    <input checked="true" */}
                        {/*        type="radio" */}
                        {/*        value="Female" */}
                        {/*        name="gender" */}
                        {/*        checked={this.state.selectedOption === "Female"}*/}
                        {/*        onChange={this.handleRadioBtnChng}*/}
                        {/*    /> زن*/}

                        {/*    <input */}
                        {/*        className="mr-4" */}
                        {/*        checked={this.state.selectedOption === "Male"}*/}
                        {/*        onChange={this.handleRadioBtnChng} */}
                        {/*        type="radio" */}
                        {/*        value="Male" */}
                        {/*        name="gender" */}
                        {/*    /> مرد*/}
                        {/*</div>*/}
                        <Field
                            name="firstName"
                            type="text"
                            placeholder={this.props.t('firstName')}
                            component={this.renderInputs}
                            extra={"my-4 mx-2"}
                        />
                        <Field
                            name="lastName"
                            type="text"
                            placeholder={this.props.t('lastName')}
                            component={this.renderInputs}
                            extra={"my-4 mx-2"}
                        />
                        <Field
                            name="personalIdNUmber"
                            type="text"
                            placeholder={this.props.t('personelCode')}
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />
                        {/* <Field
                            name="latinLastname"
                            type="text"
                            placeholder="نام خانوادگی لاتین"
                            component={this.renderInputs}
                            extra={"w-40 my-4"}
                        /> */}
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder={this.props.t('nationCode')}
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />

                        <Field
                            name="phoneNumber"
                            type="text"
                            placeholder={this.props.t('phoneNumber')}
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />

                        <div className="w-full my-4 flex flex-row-reverse justify-between items-center">
                            <span className="text-white">{this.props.t('gender')}</span>
                            <span onClick={() => this.handleRadioBtnChng("Female")} className={`w-1/3 text-center py-2 cursor-pointer border-2 ${this.state.selectedOption === 'Female' ? 'border-redish text-redish' : 'border-grayish text-grayish'}`}>{this.props.t('female')}</span>
                            <span onClick={() => this.handleRadioBtnChng("Male")} className={`w-1/3 text-center py-2 cursor-pointer border-2 ${this.state.selectedOption === 'Male' ? 'border-sky-blue text-sky-blue' : 'border-grayish text-grayish'}`}>{this.props.t('male')}</span>
                        </div>
                        <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">{this.props.t('save')}</button>
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
const cwrapped = connect(mapStateToProps , {addNewTeacher})(authWrapped);

export default withTranslation()(cwrapped)