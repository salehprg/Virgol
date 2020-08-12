import React from 'react';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';

class TeacherInfo extends React.Component {

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

    onSubmit = (formValues) => {

    }

    render() {
        return (
            <div>
                <Add 
                    onCancel={() => history.push('/m/teachers')}
                    title={"اطلاعات معلم"}
                >
                    <form className="w-full" onSubmit={this.props.handleSubmit(this.onSubmit)}>
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
                <Field
                    name="personalIdNumber"
                    type="text"
                    placeholder="کد پرسنلی"
                    component={this.renderInputs}
                />

                <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">ذخیره</button>
            </form>
                </Add>
            </div>
        );
    }

}

const formWrapped = reduxForm({
    form: 'editTeacher'
})(TeacherInfo)

export default connect(null)(formWrapped);