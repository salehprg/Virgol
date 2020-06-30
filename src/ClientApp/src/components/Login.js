import React from 'react';
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { login, fadeError } from "../actions";
import {Field, reduxForm} from "redux-form";
import {fingerprint, lock, loading} from "../assets/icons";

class Login extends React.Component {

    renderFormInputs = ({ input, meta, placeholder, icon, type }) => {
        return (
            <div className={`flex px-1 flex-row py-3 my-6 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
                <input
                    {...input}
                    className="w-full px-2 placeholder-grayish focus:outline-none"
                    type={type}
                    placeholder={placeholder}
                />
                {icon}
            </div>
        );
    }

    onSubmit = (formValues) => {
        this.props.login(formValues);
    }

    hideError = () => {
        this.props.fadeError();
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-dark-blue flex flex-col md:flex-row justify-center items-center">
                <div className="max-w-xl py-8 text-center order-2 md:order-1">
                    <p className="text-golden text-3xl mb-12">ویرگول <br />سیستم مدیریت یکپارچه آموزش مدارس</p>
                    <Link className="bg-blueish hover:bg-darker-blueish text-white text-xl transition-all duration-200 px-12 py-2 rounded-full" to="/SignUp">ثبت نام</Link>
                </div>

                <div className="md:w-1/4 w-5/6 md:min-w-400 h-500 order-1 md:order-2 rounded-lg bg-white flex flex-col mt-8 md:mt-0 md:ml-24 justify-start items-center">
                    <img className="w-1/3 mb-12" alt="placeholder logo" src="/placeholder logo.png" />
                    <form className="w-3/4 text-center" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <Field
                            name="username"
                            type="text"
                            placeholder="نام کاربری"
                            component={this.renderFormInputs}
                            icon={fingerprint("text-golden w-6 h-6")}
                        />
                        <Field
                            name="password"
                            type="password"
                            placeholder="رمز ورود"
                            component={this.renderFormInputs}
                            icon={lock("text-golden w-6 h-6")}
                        />
                        <button className="bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green w-full py-2 rounded-lg">
                            {this.props.isThereLoading && this.props.loadingComponent === 'Login' ? loading("w-8 h-8 text-dark-green") : 'ورود'}
                        </button>
                    </form>
                    <span
                        className={`bg-red-500 hover:bg-red-700 cursor-pointer text-white text-center px-4 py-2 mt-12 ${this.props.isThereError ? 'inline' : 'hidden'}`}
                        onClick={this.hideError}
                    >
                        {this.props.errorMessage}
                    </span>
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.username) errors.username = true;
    if (!formValues.password) errors.password = true;

    return errors;
}

const mapStateToProps = (state) => {
    return {
        isThereError: state.error.isThereError,
        errorMessage: state.error.errorMessage,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

const formWrapped = reduxForm({
    form: 'loginForm',
    validate
})(Login);

export default connect(mapStateToProps, {login, fadeError})(formWrapped);