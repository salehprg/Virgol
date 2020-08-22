import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {GetUserInfo , EmptyUserInfo , EditStudent} from "../../../../_actions/managerActions"
import { validator } from '../../../../assets/validator';
import protectedManager from "../../../protectedRoutes/protectedManager";


class StudentInfo extends React.Component {

    state = {selectedOption : ""}

    componentDidMount = async () => {
        await this.props.GetUserInfo(this.props.user.token , parseInt(this.props.match.params.id))
        if(this.props.userInfo)
        {
            this.setState({selectedOption : this.props.userInfo.sexuality === 0 ? "Female" : "Male"})
        }
    }

    emptyData = async () =>{
        await this.props.EmptyUserInfo()
        history.push('/m/students')
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

    handleRadioBtnChng = (e) =>{
        this.setState({selectedOption : e.target.value});
    }

    onSubmit = async (formValues) => {
        
        formValues.id = parseInt(this.props.match.params.id);
        formValues.sexuality = (this.state.selectedOption === "Male" ? 1 : 0)
        formValues.studentDetail = {
                fatherName : formValues.fatherName,
                fatherPhoneNumber : formValues.fatherPhoneNumber
        }
        
        await this.props.EditStudent(this.props.user.token , formValues)
    }

    render() {
        return (
            <div>
                <Add 
                    onCancel={() => this.emptyData()}
                    title={"اطلاعات دانش آموز"}
                >
                    <form className="w-full" style={{direction : "rtl"}}  onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <div className="text-white">
                            <input checked="true" 
                                type="radio" 
                                value="Female" 
                                name="gender" 
                                checked={this.state.selectedOption === "Female"}
                                onChange={this.handleRadioBtnChng}
                            /> دختر

                            <input 
                                className="mr-4" 
                                checked={this.state.selectedOption === "Male"}
                                onChange={this.handleRadioBtnChng} 
                                type="radio" 
                                value="Male" 
                                name="gender" 
                            /> پسر
                        </div>
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
                            placeholder="تلفن همراه"
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
                            placeholder="نام ولی"
                            component={this.renderInputs}
                            extra={"w-40 my-4"}
                        />
                        <Field
                            name="fatherPhoneNumber"
                            type="text"
                            placeholder="تلفن همراه ولی"
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
    console.log(state)
    return {
        user: state.auth.userInfo , 
        userInfo : state.managerData.userInfo,
        initialValues: {
            firstName: state.managerData.userInfo ? state.managerData.userInfo.firstName : null,
            lastName: state.managerData.userInfo ? state.managerData.userInfo.lastName : null,
            melliCode: state.managerData.userInfo ? state.managerData.userInfo.melliCode : null,
            phoneNumber: state.managerData.userInfo ? state.managerData.userInfo.phoneNumber : null,
            latinFirstname: state.managerData.userInfo ? state.managerData.userInfo.latinFirstname : null,
            latinLastname: state.managerData.userInfo ? state.managerData.userInfo.latinLastname : null,
            fatherName: state.managerData.userInfo ? state.managerData.userInfo.fatherName : null,
            fatherPhoneNumber: state.managerData.userInfo ? state.managerData.userInfo.fatherPhoneNumber : null,
            
        }
    }
}

const validate = formValues => {
    const errors = {}
    const { firstName, lastName, melliCode, fatherName } = formValues

    if (!firstName || !validator.checkPersian(firstName)) errors.firstName = true
    if (!lastName || !validator.checkPersian(lastName)) errors.lastName = true
    //if (!validator.checkMelliCode(melliCode)) errors.melliCode = true
    if (!fatherName || !validator.checkPersian(fatherName)) errors.fatherName = true
    
    return errors
}

const formWrapped = reduxForm({
    form: 'editStudent',
    validate,
    enableReinitialize : true
})(StudentInfo)

const authWrapped = protectedManager(formWrapped)

export default connect(mapStateToProps , {EditStudent , GetUserInfo , EmptyUserInfo})(authWrapped);