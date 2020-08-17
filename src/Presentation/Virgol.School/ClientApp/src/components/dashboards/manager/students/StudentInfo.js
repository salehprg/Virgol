import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {GetUserInfo , EditStudent} from "../../../../_actions/managerActions"
import { validator } from '../../../../assets/validator';


class StudentInfo extends React.Component {

    componentDidMount = async () => {
        await this.props.GetUserInfo(this.props.user.token , parseInt(this.props.match.params.id))
    }

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
        
        formValues.id = parseInt(this.props.match.params.id);
        formValues.userDetail = {
                latinLastname : formValues.latinLastname,
                latinFirstname : formValues.latinFirstname,
                fatherName : formValues.fatherName,
                fatherPhoneNumber : formValues.fatherPhoneNumber
        }
        
        await this.props.EditStudent(this.props.user.token , formValues)
    }

    render() {
        return (
            <div>
                <Add 
                    onCancel={() => history.push('/m/students')}
                    title={"اطلاعات دانش آموز"}
                >
                    <form className="w-full" style={{direction : "rtl"}}  onSubmit={this.props.handleSubmit(this.onSubmit)}>
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
    return {
        user: state.auth.userInfo , 
        initialValues: {
            firstName: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.firstName : null,
            lastName: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.lastName : null,
            melliCode: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.melliCode : null,
            phoneNumber: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.phoneNumber : null,
            fatherName: state.managerData.userInfo.userModel.studentDetail ? state.managerData.userInfo.studentDetail.fatherName : null,
            fatherPhoneNumber: state.managerData.userInfo.studentDetail ? state.managerData.userInfo.studentDetail.fatherPhoneNumber : null,
            latinFirstname: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.latinFirstname : null,
            latinLastname: state.managerData.userInfo.userModel ? state.managerData.userInfo.userModel.latinLastname : null
        }
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

const formWrapped = reduxForm({
    form: 'editStudent',
    validate,
    enableReinitialize : true
})(StudentInfo)

export default connect(mapStateToProps , {EditStudent , GetUserInfo})(formWrapped);