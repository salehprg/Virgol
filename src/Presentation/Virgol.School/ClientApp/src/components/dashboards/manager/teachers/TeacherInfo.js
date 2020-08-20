import React from 'react';
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

    handleRadioBtnChng = (e) =>{
        this.setState({selectedOption : e.target.value});
    }

    onSubmit = async (formValues) => {
        
        formValues.id = parseInt(this.props.match.params.id)
        formValues.sexuality = (this.state.selectedOption === "Male" ? 1 : 0)
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
                    title={"اطلاعات معلم"}
                >
                    <form className="w-full" style={{direction : "rtl"}}  onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <div className="text-white">
                            <input checked="true" 
                                type="radio" 
                                value="Female" 
                                name="gender" 
                                checked={this.state.selectedOption === "Female"}
                                onChange={this.handleRadioBtnChng}
                            /> زن

                            <input 
                                className="mr-4" 
                                checked={this.state.selectedOption === "Male"}
                                onChange={this.handleRadioBtnChng} 
                                type="radio" 
                                value="Male" 
                                name="gender" 
                            /> مرد
                        </div>
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
                            placeholder="تلفن همراه"
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

export default connect(mapStateToProps , {editTeacher , GetUserInfo , EmptyUserInfo})(authWrapped);