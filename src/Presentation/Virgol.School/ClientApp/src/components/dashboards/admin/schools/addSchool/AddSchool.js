import React from "react";
import { withTranslation } from 'react-i18next';
import Add from "../../../../field/Add";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {reduxForm, Field} from 'redux-form';
import history from "../../../../../history";
import Fieldish from '../../../../field/Fieldish';
import { check_circle } from "../../../../../assets/icons";
import ManagerGenerated from "./ManagerGenerated";
import {CreateSchool} from "../../../../../_actions/schoolActions";
import { validator } from '../../../../../assets/validator'
import protectedAdmin from "../../../../protectedRoutes/protectedAdmin";

class AddSchool extends React.Component {

    state = { showManagerInfo: true , selectedOption : "Male"}

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

    handleRadioBtnChng = (gender) => {
        this.setState({selectedOption : gender});
    }

    onSubmit = async (formValues) => {
        formValues.sexuality = (this.state.selectedOption === "Male" ? 1 : 0)
        await this.props.CreateSchool(this.props.user.token , formValues)
        this.setState({showManagerInfo : false})
    }

    render() {
        return (
            <Add 
                isNews={true}
                // className="max-w-md"
                newsClassName={"max-w-md w-11/12 "}
                onCancel={() => history.push('/a/schools')}
                title={this.props.t('addSchool')}
            >
                {this.state.showManagerInfo || !this.props.managerInfo ? 
                <form className="w-full" style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <div className="w-full flex flex-row justify-between items-center">
                    <Field
                        name="schoolName"
                        type="text"
                        placeholder={this.props.t('schoolName')}
                        extra={"w-3/4 ml-1 my-4"}
                        component={this.renderInputs}
                    />
                    <Field
                        name="schoolIdNumber"
                        type="text"
                        placeholder={this.props.t('code')}
                        extra={"w-1/4 mr-1 my-4"}
                        component={this.renderInputs}
                    />
                </div>

                <div className="w-full my-4 flex justify-between items-center">
                    <span className="text-white"> {this.props.t('gender')} </span>
                    <span onClick={() => this.handleRadioBtnChng("Female")} className={`w-1/3 text-center py-2 cursor-pointer border-2 ${this.state.selectedOption === 'Female' ? 'border-redish text-redish' : 'border-grayish text-grayish'}`}> {this.props.t('feminine')} </span>
                    <span onClick={() => this.handleRadioBtnChng("Male")} className={`w-1/3 text-center py-2 cursor-pointer border-2 ${this.state.selectedOption === 'Male' ? 'border-sky-blue text-sky-blue' : 'border-grayish text-grayish'}`}> {this.props.t('masculine')} </span>
                </div>
                
                {/*<div className="text-white">*/}
                {/*    <input checked="true" */}
                {/*        type="radio" */}
                {/*        value="Female" */}
                {/*        name="gender" */}
                {/*        className="form-radio"*/}
                {/*        checked={this.state.selectedOption === "Female"}*/}
                {/*        onChange={this.handleRadioBtnChng}*/}
                {/*    /> دخترانه*/}

                {/*    <input */}
                {/*        className="mr-4" */}
                {/*        checked={this.state.selectedOption === "Male"}*/}
                {/*        onChange={this.handleRadioBtnChng} */}
                {/*        type="radio" */}
                {/*        value="Male" */}
                {/*        name="gender" */}
                {/*    /> پسرانه*/}
                {/*</div>*/}
                
                <div className="w-full flex flex-row justify-between items-center">
                    <Field
                        name="firstName"
                        type="text"
                        placeholder={this.props.t('managerFirstName')}
                        extra={"w-1/2 my-4 mx-2"}
                        component={this.renderInputs}
                    />
                    <Field
                        name="lastName"
                        type="text"
                        extra={"w-1/2 my-4"}
                        placeholder={this.props.t('managerLastName')}
                        component={this.renderInputs}
                    />
                </div>
                <div className="w-full flex flex-row justify-between items-center">
                    <Field
                        name="latinFirstname"
                        type="text"
                        placeholder={this.props.t('latinFirstName')}
                        extra={"w-1/2 my-4 mx-2"}
                        component={this.renderInputs}
                    />
                    <Field
                        name="latinLastname"
                        type="text"
                        extra={"w-1/2 my-4"}
                        placeholder={this.props.t('latinLastName')}
                        component={this.renderInputs}
                    />
                </div>
                <Field
                    name="managerPhoneNumber"
                    type="text"
                    extra={"w-full my-4"}
                    placeholder={this.props.t('managerPhoneNumber')}
                    component={this.renderInputs}
                />
                <div className="w-full flex flex-row justify-between items-center">
                    <Field
                        name="melliCode"
                        type="text"
                        placeholder={this.props.t('managerNationCode')}
                        extra={"w-1/2 ml-1 my-4"}
                        component={this.renderInputs}
                    />
                    <Field
                        name="personalIdNumber"
                        type="text"
                        placeholder={this.props.t('managerPersonelCode')}
                        extra={"w-1/2 mr-1 my-4"}
                        component={this.renderInputs}
                    />
                </div>

                <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg"> {this.props.t('add')} </button>
            </form> 
                : 
                <div className="p-6 border-2 border-dashed border-dark-blue">
                    {check_circle('w-1/4 mx-auto text-greenish')}
                    <p className="text-center text-greenish">
                        {this.props.t('schoolCreated')}
                    </p>
                    <ManagerGenerated 
                        title={this.props.t('username')}
                        value={this.props.managerInfo.melliCode}
                    />
                    <ManagerGenerated 
                        title={this.props.t('password')}
                        value={this.props.managerInfo.password}
                    />
                    <button type="button" className="w-full px-4 py-2 border-2 border-sky-blue text-sky-blue" onClick={() => history.push(`/school/${this.props.managerInfo.schoolId}`)}> {this.props.t('addingLessons')} </button>
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
    if (!formValues.latinFirstname || !validator.checkEnglish(formValues.latinFirstname)) errors.latinFirstname = true
    if (!formValues.latinLastname || !validator.checkEnglish(formValues.latinLastname)) errors.latinLastname = true
    if (!formValues.melliCode && !validator.checkMelliCode(formValues.melliCode)) errors.melliCode = true
    if (!formValues.personalIdNumber) errors.personalIdNumber = true
    if (!formValues.managerPhoneNumber || !validator.checkPhoneNumber(formValues.managerPhoneNumber)) errors.managerPhoneNumber = true

    return errors;

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , managerInfo: state.schoolData.CreateSchool}
}

const formWrapped = reduxForm({
    form: 'schoolInfo',
    validate
}, mapStateToProps)(AddSchool)

const authWrapped = protectedAdmin(formWrapped)
const cwrapped = connect(mapStateToProps,{CreateSchool})(authWrapped);

export default withTranslation()(cwrapped);