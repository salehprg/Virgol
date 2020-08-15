import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {GetUserInfo , editTeacher} from "../../../../_actions/managerActions"


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
            firstName: state.managerData.userInfo ? state.managerData.userInfo.firstName : null,
            lastName: state.managerData.userInfo ? state.managerData.userInfo.lastName : null,
            melliCode: state.managerData.userInfo ? state.managerData.userInfo.melliCode : null,
            phoneNumber: state.managerData.userInfo ? state.managerData.userInfo.phoneNumber : null
        }
    }
}

const formWrapped = reduxForm({
    form: 'editTeacher',
    enableReinitialize : true
}, mapStateToProps)(TeacherInfo)

export default connect(mapStateToProps , {editTeacher , GetUserInfo})(formWrapped);