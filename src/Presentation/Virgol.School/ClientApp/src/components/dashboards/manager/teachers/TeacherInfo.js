import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {GetUserInfo , editTeacher} from "../../../../_actions/managerActions"
import { validator } from '../../../../assets/validator';


class TeacherInfo extends React.Component {


    componentDidMount = async () => {
        await this.props.GetUserInfo(this.props.user.token , parseInt(this.props.match.params.id))
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

    onSubmit = async (formValues) => {
        
        formValues.id = parseInt(this.props.match.params.id)
        formValues.teacherDetail = {
            personalIdNUmber : formValues.personalIdNUmber
        }
        await this.props.editTeacher(this.props.user.token , formValues)
    }

    render() {
        return (
            <div>
                <Add 
                    onCancel={() => history.push('/m/teachers')}
                    title={"اطلاعات معلم"}
                >
                    <form className="w-full" style={{direction : "rtl"}}  onSubmit={this.props.handleSubmit(this.onSubmit)}>
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
                            name="personalIdNUmber"
                            type="text"
                            placeholder="کد پرسنلی"
                            component={this.renderInputs}
                        />
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder="کد ملی"
                            component={this.renderInputs}
                        />
                        <Field
                            name="phoneNumber"
                            type="text"
                            placeholder="شماره همراه"
                            component={this.renderInputs}
                        />

                        <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">ذخیره</button>
                    </form>
                </Add>
            </div>
        );
    }

}

const mapStateToProps = state => {

    return {
        user: state.auth.userInfo , 
        initialValues: {
            firstName: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.firstName : null,
            lastName: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.lastName : null,
            melliCode: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.melliCode : null,
            phoneNumber: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.phoneNumber : null,
            personalIdNUmber: state.managerData.userInfo.teacherDetail ? state.managerData.userInfo.teacherDetail.personalIdNUmber : null
        
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

export default connect(mapStateToProps , {editTeacher , GetUserInfo})(formWrapped);