import React from 'react';
import { withTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker2';
import history from '../../../history'
import Add from '../../field/Add';
import Fieldish from '../../field/Fieldish';
import { reduxForm, Field, formValues } from 'redux-form'
import { connect } from 'react-redux';
import { CompleteTeacherProfile} from "../../../_actions/authActions"
import moment from 'moment-jalaali'
import { validator } from '../../../assets/validator'
import protectedTeacher from "../../protectedRoutes/protectedTeacher";

class CompleteProfile extends React.Component {

    state = {birthDate : moment()}
    renderInputs = ({ input, meta, type, placeholder,extra }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra={`${extra}`}
            />
        );
    }

    onSubmit = async (formValues) => {
        
        let data = formValues;

        data.teacherDetail = {
            //personalIdNUmber : formValues.personalIdNUmber,
            birthDate : (this.state.birthDate ? this.state.birthDate._d : null),
            cityBirth: formValues.cityBirth
        }

        
        await this.props.CompleteTeacherProfile(this.props.user.token , data)
    }

    render() {
        return (
            <div>
                <Add
                    onCancel={() => history.push('/')}
                    title={this.props.t('completeProfile')}
                >
                    <form className="tw-w-full tw-text-right " style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <p className="tw-text-right tw-text-white tw-mb-6 tw-text-xl">{this.props.user.userInformation.firstName} {this.props.user.userInformation.lastName}</p>
                        <p className="tw-text-right tw-text-white tw-mb-6 tw-text-xl">{this.props.t('personelCode')} : {this.props.user.userDetail.userDetail.personalIdNUmber}</p>
                        <Field
                            name="latinFirstname"
                            type="text"
                            placeholder={this.props.t('latinFirstName')}
                            component={this.renderInputs}
                            extra={"tw-w-40 tw-my-4 tw-mx-2"}
                        />
                        <Field
                            name="latinLastname"
                            type="text"
                            placeholder={this.props.t('latinLastName')}
                            component={this.renderInputs}
                            extra={"tw-w-40 tw-my-4"}
                        />
                        {/* <Field
                            name="personalIdNUmber"
                            type="text"
                            placeholder="کد پرسنلی"
                            component={this.renderInputs}
                            extra={"tw-w-full tw-my-4 tw-mx-2"}
                        /> */}
                        <Field
                            name="cityBirth"
                            type="text"
                            placeholder={this.props.t('birthPlace')}
                            component={this.renderInputs}
                            extra={"tw-w-full tw-my-4 tw-mx-2"}
                        />
                        <p className="tw-text-right tw-text-white tw-mb-4 tw-text-xl">{this.props.t('birthDate')} :</p>
                        <DatePicker
                            className="tw-bg-transparent tw-text-white  tw-border-2 tw-border-dark-blue tw-rounded-lg tw-p-2 tw-mr-2 cursor-pointer"
                            timePicker={false}
                            isGregorian={false}
                            value={this.state.birthDate}
                            onChange={value => this.setState({ birthDate : value })}
                        ></DatePicker>
                        

                    <button type="submit" className="tw-w-full tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg">{this.props.t('save')}</button>
                    </form>
                </Add>
            </div>
        );
    }

}

const validate = formValues => {
    const errors = {}

    if (!formValues.latinFirstname || !validator.checkEnglish(formValues.latinFirstname)) errors.latinFirstname = true
    if (!formValues.latinLastname  || !validator.checkEnglish(formValues.latinLastname)) errors.latinLastname = true
    //if (!formValues.personalIdNUmber) errors.personalIdNUmber = true

    return errors;
}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo ,
        initialValues: {
            firstName: state.auth.userInfo.userInformation ? state.auth.userInfo.userInformation.firstName : null,
            lastName: state.auth.userInfo.userInformation ? state.auth.userInfo.userInformation.lastName : null
        }
    }
}

const formWrapped = reduxForm({
    form: 'teacherProfile',
    enableReinitialize : true,
    validate
})(CompleteProfile)

const authWrapped = protectedTeacher(formWrapped)
const cwrapped = connect(mapStateToProps , {CompleteTeacherProfile})(authWrapped);

export default withTranslation()(cwrapped);