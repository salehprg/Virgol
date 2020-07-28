import React from 'react';
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { login, logout, sendVerificationCode, forgotPassFade, sendCodeFade } from "../../_actions/authActions";
import {Field, reduxForm} from "redux-form";
import {fingerprint, lock, loading, heart, eye} from "../../assets/icons";
import ForgotPassCode from "./ForgotPassCode";

class Login extends React.Component {

    state = { loginLoading: false, sendCodeLoading: false, renderContent: "loginForm", passVisible: false }

    componentDidMount() {
        this.props.logout()
    }

    goHome = () => {
        this.setState({ renderContent: 'loginForm' })
        this.setState({ sendCodeLoading: false })
    }

    fadeSuccess = () => {
        this.props.forgotPassFade();
        this.setState({ renderContent: 'loginForm' })
    }

    renderContent = () => {

        if (this.props.sendCode.success) {
            return (
                <React.Fragment>
                    <p dir="rtl" className="text-center w-5/6">رمز ورودتو موقتا به کد ملیت تغییر دادیم وارد شو و رمز ورودتو حتما عوض کن</p>
                    <span onClick={this.fadeSuccess} className="cursor-pointer transition-all duration-200 hover:text-green-400">بازگشت به صفحه ورود</span>
                </React.Fragment>
            );
        }

        if (this.props.sendCode.status) {
            return (
                <React.Fragment>
                    <ForgotPassCode />
                    <span onClick={() => this.setState({ renderContent: 'forgot password' })} className="cursor-pointer transition-all duration-200 hover:text-red-400">پیامکی دریافت نکردید؟</span>
                    <span onClick={this.goHome} className="cursor-pointer transition-all duration-200 hover:text-green-400">بازگشبت به صفحه ورود</span>
                </React.Fragment>
            );
        }

        if (this.state.renderContent === 'loginForm') {
            return (
                <React.Fragment>
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
                            type={this.state.passVisible ? "text" : "password"}
                            placeholder="رمز ورود"
                            component={this.renderFormInputs}
                            icon={lock("text-golden w-6 h-6")}
                        />
                        <button className="bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green w-full py-2 rounded-lg focus:outline-none focus:shadow-outline">
                            { this.state.loginLoading ? loading("w-8 h-8 text-dark-green") : 'ورود' }
                        </button>
                    </form>
                    <span onClick={() => this.setState({ renderContent: 'forgot password' })} className="cursor-pointer transition-all duration-200 hover:text-red-400">رمز عبورم را فراموش کرده ام</span>
                </React.Fragment>
            );
        } else if (this.state.renderContent === 'forgot password') {
            return (
                <React.Fragment>
                    <form onSubmit={this.props.handleSubmit(this.onSendForgetCode)} className="w-3/4 text-center">
                        <p dir="rtl">نگران نباش ما کمکت میکنیم به حسابت برگردی برای شروع کد ملیتو وارد کن تا یه پیامک برات ارسال کنیم :)</p>
                        <Field
                            name="IdNumer"
                            type="text"
                            placeholder="کد ملی"
                            component={this.renderFormInputs}
                            icon={heart("text-golden w-6 h-6")}
                        />
                        <button className="bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green w-full py-2 rounded-lg focus:outline-none focus:shadow-outline">
                            {this.state.sendCodeLoading ? loading("w-8 h-8 text-dark-green") : 'ارسال کد'}
                        </button>
                    </form>
                    <span onClick={() => this.setState({ renderContent: 'loginForm' })} className="cursor-pointer transition-all duration-200 hover:text-green-400">بازگشت به صفحه ورود</span>
                </React.Fragment>
        );
        }

    }

    revealPass = () => {
        this.setState({ passVisible: true })
    }

    hidePass = () => {
        this.setState({ passVisible: false })
    }

    renderFormInputs = ({ input, meta, placeholder, icon, type }) => {
        return (
            <div className={`flex px-1 flex-row my-6 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
                <div onMouseDown={this.revealPass} onMouseUp={this.hidePass} >
                    {eye(`w-5 h-5 text-grayish cursor-pointer ${input.name === "password" ? '' : 'invisible'}`)}
                </div>
                <input
                    {...input}
                    className="w-full px-2 py-3 placeholder-grayish focus:outline-none"
                    type={type}
                    placeholder={placeholder}
                />
                {icon}
            </div>
        );
    }

    onSubmit = async (formValues) => {

        if (!this.state.loginLoading) {
            this.setState({ loginLoading: true })
            await this.props.login(formValues);
            this.setState({ loginLoading: false })
        }

    }

    onSendForgetCode = async (formValues) => {

        if (!this.state.sendCodeLoading) {
            this.setState({sendCodeLoading: true})
            await this.props.sendVerificationCode(formValues);
            this.setState({sendCodeLoading: false})
        }

    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-dark-blue flex flex-col md:flex-row justify-center items-center">
                <div className="max-w-xl py-8 text-center order-2 md:order-1">
                    <p className="text-golden text-3xl mb-12">ویرگول <br />سیستم مدیریت یکپارچه آموزش مدارس</p>
                    <Link className="bg-blueish hover:bg-darker-blueish text-white text-xl transition-all duration-200 px-12 py-2 rounded-full" to="/SignUp">ثبت نام</Link>
                </div>

                <div className="md:w-1/4 w-5/6 md:min-w-400 h-500 order-1 md:order-2 rounded-lg bg-white flex flex-col mt-8 md:mt-0 md:ml-24 justify-between py-8 items-center">
                    <img className="w-1/2 mb-12" alt="placeholder logo" src="/logov.jpg" />
                    {this.renderContent()}
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.username) errors.username = true;
    if (!formValues.password) errors.password = true;
    if (!formValues.IdNumer) errors.IdNumer = true;

    return errors;
}

const mapStateToProps = (state) => {
    return {
        sendCode: state.auth.sendCode
    }
}

const formWrapped = reduxForm({
    form: 'loginForm',
    validate
})(Login);

export default connect(mapStateToProps, {login, logout, sendVerificationCode, sendCodeFade, forgotPassFade})(formWrapped);