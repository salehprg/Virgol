import React from 'react';
import { withTranslation } from 'react-i18next';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {AddNewStudent } from "../../../../_actions/managerActions"
import { validator } from '../../../../assets/validator'
import protectedManager from "../../../protectedRoutes/protectedManager";

class AddStudent extends React.Component {

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

    onSubmit = async (formValues) => {
        
        let data = formValues;

        data.sexuality = (this.state.selectedOption === "Male" ? 1 : 0)

        data.studentDetail = {
            fatherName : formValues.fatherName,
            fatherPhoneNumber : formValues.fatherPhoneNumber
        }
        
        await this.props.AddNewStudent(this.props.user.token , data)
    }

    handleRadioBtnChng = (gender) =>{
        this.setState({selectedOption : gender});
    }

    render() {
        return (
                <Add
                    onCancel={() => history.push('/m/students')}
                    title={this.props.t('studentInfo')}
                >
                    <form className="w-full" style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        {/*<div className="text-white">*/}
                        {/*    <input checked="true" */}
                        {/*        type="radio" */}
                        {/*        value="Female" */}
                        {/*        name="gender" */}
                        {/*        checked={this.state.selectedOption === "Female"}*/}
                        {/*        onChange={this.handleRadioBtnChng}*/}
                        {/*    /> دختر*/}

                        {/*    <input */}
                        {/*        className="mr-4" */}
                        {/*        checked={this.state.selectedOption === "Male"}*/}
                        {/*        onChange={this.handleRadioBtnChng} */}
                        {/*        type="radio" */}
                        {/*        value="Male" */}
                        {/*        name="gender" */}
                        {/*    /> پسر*/}
                        {/*</div>*/}
                        <Field
                            name="firstName"
                            type="text"
                            placeholder={this.props.t('firstName')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="lastName"
                            type="text"
                            placeholder={this.props.t('lastName')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder={this.props.t('nationCode')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="fatherName"
                            type="text"
                            placeholder={this.props.t('fatherName')}
                            component={this.renderInputs}
                        />

                        <div className="w-full my-4 flex justify-between items-center">
                            <span className="text-white"> {this.props.t('gender')} </span>
                            <span onClick={() => this.handleRadioBtnChng("Female")} className={`w-1/3 text-center py-2 cursor-pointer border-2 ${this.state.selectedOption === 'Female' ? 'border-redish text-redish' : 'border-grayish text-grayish'}`}> {this.props.t('girl')} </span>
                            <span onClick={() => this.handleRadioBtnChng("Male")} className={`w-1/3 text-center py-2 cursor-pointer border-2 ${this.state.selectedOption === 'Male' ? 'border-sky-blue text-sky-blue' : 'border-grayish text-grayish'}`}> {this.props.t('boy')} </span>
                        </div>
                        <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg"> {this.props.t('save')} </button>
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
    if (!validator.checkMelliCode(melliCode)) errors.melliCode = true
    if (!fatherName || !validator.checkPersian(fatherName)) errors.fatherName = true
    
    return errors
}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo 
    }
}

const formWrapped = reduxForm({
    form: 'addStudent',
    validate
})(AddStudent)

const authWrapped = protectedManager(formWrapped)
const cwrapped = connect(mapStateToProps , {AddNewStudent })(authWrapped);

export default withTranslation()(cwrapped);