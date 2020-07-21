import React from 'react';
import { connect } from 'react-redux';
import { addNewTeacher } from "../../../../actions";
import {Field, reduxForm} from "redux-form";
import {clear, teaching, loading} from "../../../../assets/icons";
import history from "../../../../history";

class AddTeacher extends React.Component {

    state = { loading: false }

    renderFormInputs = ({ input, meta, placeholder }) => {
        return (
            <div className={`flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
                <input
                    {...input}
                    dir="rtl"
                    className="w-full px-2 placeholder-grayish focus:outline-none"
                    type="text"
                    placeholder={placeholder}
                />
            </div>
        );
    }

    onSubmit = async (formValues) => {
        this.setState({ loading: true });
        await this.props.addNewTeacher(this.props.token, formValues);
        this.setState({ loading: false })
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-blueish flex justify-center items-center">
                <div className="max-w-600 relative w-5/6 bg-white flex flex-col justify-center items-center">
                    <div onClick={() => history.push("/a/dashboard")} className="absolute top-0 right-0">
                        {clear("w-6 h-8 text-black cursor-pointer")}
                    </div>
                    {teaching("w-1/3 text-blueish")}
                    <form className="w-3/5 text-center" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <Field
                            name="firstName"
                            placeholder="نام"
                            component={this.renderFormInputs}
                        />
                        <Field
                            name="lastName"
                            placeholder="نام خانوادگی"
                            component={this.renderFormInputs}
                        />
                        <Field
                            name="melliCode"
                            placeholder="کد ملی"
                            component={this.renderFormInputs}
                        />
                        <Field
                            name="phoneNumber"
                            placeholder="شماره همراه"
                            component={this.renderFormInputs}
                        />
                        <Field
                            name="latinFirstName"
                            placeholder="نام لاتین"
                            component={this.renderFormInputs}
                        />
                        <Field
                            name="latinLastName"
                            placeholder="نام خانوادگی لاتین"
                            component={this.renderFormInputs}
                        />
                        <button className="bg-golden my-6 flex justify-center items-center hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg">
                            {this.state.loading ? loading("w-8 text-dark-green") : 'افزودن'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.firstName) errors.firstName = true
    if (!formValues.lastName) errors.lastName = true
    if (!formValues.melliCode) errors.melliCode = true
    if (!formValues.phoneNumber) errors.phoneNumber = true
    if (!formValues.latinFirstName) errors.latinFirstName = true
    if (!formValues.latinLastName) errors.latinLastName = true

    return errors;
}

const formWrapped = reduxForm({
    form: 'loginForm',
    validate
})(AddTeacher);

const mapStateToProps = state => {
    return { token: state.auth.userInfo.token }
}

export default connect(mapStateToProps, { addNewTeacher })(formWrapped);