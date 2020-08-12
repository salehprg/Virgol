import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {GetUserInfo , EditStudent} from "../../../../_actions/managerActions"


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
        
        let data = {
            id : parseInt(this.props.match.params.id),
            firstName : formValues.firstName,
            lastName : formValues.lastName,
            phoneNumber : formValues.phoneNumber,
            fatherName : formValues.fatherName,
            fatherPhoneNumber : formValues.fatherPhoneNumber,
            userDetail : {
                latinLastname : formValues.latinLastname,
                latinFirstname : formValues.latinFirstname,
                fatherName : formValues.fatherName,
                fatherPhoneNumber : formValues.fatherPhoneNumber
            }
        }

        console.log(data)
        
        await this.props.EditStudent(this.props.user.token , data)
    }

    render() {
        return (
            <div>
                <Add 
                    onCancel={() => history.push('/m/teachers')}
                    title={"اطلاعات دانش آموز"}
                >
                    <form className="w-full" onSubmit={this.props.handleSubmit(this.onSubmit)}>
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
                            name="fatherName"
                            type="text"
                            placeholder="نام پدر"
                            component={this.renderInputs}
                            extra={"w-40 my-4 mx-2"}
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
    console.log(state)
    return {
        user: state.auth.userInfo , 
        initialValues: {
            firstName: state.managerData.userInfo ? state.managerData.userInfo.userModel.firstName : null,
            lastName: state.managerData.userInfo ? state.managerData.userInfo.userModel.lastName : null,
            melliCode: state.managerData.userInfo ? state.managerData.userInfo.userModel.melliCode : null,
            phoneNumber: state.managerData.userInfo ? state.managerData.userInfo.userModel.phoneNumber : null,
            fatherName: state.managerData.userInfo ? state.managerData.userInfo.studentDetail.fatherName : null,
            fatherPhoneNumber: state.managerData.userInfo ? state.managerData.userInfo.studentDetail.fatherPhoneNumber : null,
            latinFirstname: state.managerData.userInfo ? state.managerData.userInfo.studentDetail.latinFirstname : null,
            latinLastname: state.managerData.userInfo ? state.managerData.userInfo.studentDetail.latinLastname : null
        }
    }
}

const formWrapped = reduxForm({
    form: 'editStudent',
    enableReinitialize : true
})(StudentInfo)

export default connect(mapStateToProps , {EditStudent , GetUserInfo})(formWrapped);