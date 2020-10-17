import React from 'react';
import { withTranslation } from 'react-i18next';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {GetUserInfo , EmptyUserInfo , editTeacher} from "../../../../_actions/managerActions"
import { validator } from '../../../../assets/validator';
import protectedManager from "../../../protectedRoutes/protectedManager";


class TeacherInfo extends React.Component {

    state = {selectedOption : "Female"}

    componentDidMount = async () => {
        await this.props.GetUserInfo(this.props.user.token , parseInt(this.props.match.params.id))
        if(this.props.userInfo)
        {
            this.setState({selectedOption : this.props.userInfo.sexuality === 0 ? "Female" : "Male"})
        }
    }

    emptyData = async () =>{
        await this.props.EmptyUserInfo()
        history.push('/m/teachers')
    }

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
        
        formValues.id = parseInt(this.props.match.params.id)
        formValues.sexuality = (this.state.selectedOption == "Male" ? 1 : 0)
        formValues.teacherDetail = {
            personalIdNUmber : formValues.personalIdNUmber
        }
        await this.props.editTeacher(this.props.user.token , formValues)
    }

    render() {
        return (
            <div>
                <Add 
                    onCancel={() => this.emptyData()}
                    title={this.props.t('teacherInfo')}
                >
                    <form className="w-full" style={{direction : "rtl"}}  onSubmit={this.props.handleSubmit(this.onSubmit)}>
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
                        />
                        <Field
                            name="lastName"
                            type="text"
                            placeholder={this.props.t('lastName')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="personalIdNUmber"
                            type="text"
                            placeholder={this.props.t('personelCode')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder={this.props.t('nationCode')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="phoneNumber"
                            type="text"
                            placeholder={this.props.t('phoneNumber')}
                            component={this.renderInputs}
                        />

                        <div className="w-full my-4 flex justify-between items-center">
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

const mapStateToProps = state => {
    console.log(state)

    return {
        user: state.auth.userInfo , 
        userInfo : state.managerData.userInfo,
        initialValues: {
            firstName: state.managerData.userInfo ? state.managerData.userInfo.firstName : null,
            lastName: state.managerData.userInfo ? state.managerData.userInfo.lastName : null,
            melliCode: state.managerData.userInfo ? state.managerData.userInfo.melliCode : null,
            phoneNumber: state.managerData.userInfo ? state.managerData.userInfo.phoneNumber : null,
            personalIdNUmber: state.managerData.userInfo ? state.managerData.userInfo.personalIdNUmber : null
        
        }
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

const formWrapped = reduxForm({
    form: 'editTeacher',
    validate,
    enableReinitialize : true
}, mapStateToProps)(TeacherInfo)

const authWrapped = protectedManager(formWrapped)
const cwrapped = connect(mapStateToProps , {editTeacher , GetUserInfo , EmptyUserInfo})(authWrapped);

export default withTranslation()(cwrapped);