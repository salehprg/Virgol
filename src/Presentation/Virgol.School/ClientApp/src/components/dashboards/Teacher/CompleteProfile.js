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
import {validator} from '../../../assets/validator'
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
                    <form className="w-full text-right " style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <p className="text-right text-white mb-6 text-xl">{this.props.user.userInformation.firstName} {this.props.user.userInformation.lastName}</p>
                        <p className="text-right text-white mb-6 text-xl">{this.props.t('personelCode')} : {this.props.user.userDetail.userDetail.personalIdNUmber}</p>
                        <Field
                            name="latinFirstname"
                            type="text"
                            placeholder={this.props.t('latinFirstName')}
                            component={this.renderInputs}
                            extra={"w-40 my-4 mx-2"}
                        />
                        <Field
                            name="latinLastname"
                            type="text"
                            placeholder={this.props.t('latinLastname')}
                            component={this.renderInputs}
                            extra={"w-40 my-4"}
                        />
                        {/* <Field
                            name="personalIdNUmber"
                            type="text"
                            placeholder="کد پرسنلی"
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        /> */}
                        <Field
                            name="cityBirth"
                            type="text"
                            placeholder={this.props.t('birthPlace')}
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />
                        <p className="text-right text-white mb-4 text-xl">{this.props.t('birthDate')} :</p>
                        <DatePicker
                            timePicker={false}
                            isGregorian={false}
                            value={this.state.birthDate}
                            onChange={value => this.setState({ birthDate : value })}
                        ></DatePicker>
                        

                    <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">{this.props.t('save')}</button>
                    </form>
                </Add>
            </div>
        );
    }

}

const validate = formValues => {
    const errors = {}

    if (!formValues.latinFirstname) errors.latinFirstname = true
    if (!formValues.latinLastname) errors.latinLastname = true
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