import React from "react";
import _ from 'lodash';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { login, logout, sendVerificationCode, forgotPassword  , ChangePassword} from "../../_actions/authActions";
import {globe, loading, logo, chevron, translate} from "../../assets/icons";
import {Field, reduxForm} from "redux-form";
import Fieldish from "../field/Fieldish";
import Passish from "../field/Passish";
import SelectLang from "./SelectLang";

class Login extends React.Component {

    state = {
        passVisibility: false,
        logingin: false,
        panel: 'login',
        sendingCode: false,
        reseting: false,
        IdNumer: null,
        showLang: false
    }

    componentDidMount() {
        this.props.logout()
    }

    renderInputs = ({ input, meta, type, placeholder }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="ltr"
                placeholder={placeholder}
                extra="w-5/6 my-4"
            />
        );
    }

    renderPassword = ({ input, meta, type, placeholder }) => {
        return (
            <Passish
                input={input}
                meta={meta}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="ltr"
                placeholder={placeholder}
                extra="w-5/6 my-4"
                visible={this.state.passVisibility}
                onChange={() => this.setState({ passVisibility: !this.state.passVisibility})}
            />
        );
    }

    onLogin = async formValues => {
        if (!this.state.logingin) {
            this.setState({logingin: true})

            const success = await this.props.login(formValues)

            if (!success) this.setState({ logingin: false })
        }
    }

    sendCode = async formValues => {
        this.setState({sendingCode: true, IdNumer: formValues.IdNumer})
        const success = await this.props.sendVerificationCode(formValues)
        this.setState({sendingCode: false})
        if (success) {
            this.setState({panel: 'reset'})
        }
    }

    confirm = async formValues => {
        this.setState({reseting: true})
        const success = await this.props.ChangePassword(this.state.IdNumer, formValues.code , formValues.newPassword)
        this.setState({reseting: false})
        if (success) {
            this.setState({panel: 'login'})
        }
    }

    renderPanel = () => {
        if (this.state.panel === 'login') {
            return (
                <>
                    <form className="text-center" onSubmit={this.props.handleSubmit(this.onLogin)} >
                        <Field
                            name="username"
                            type="text"
                            placeholder={this.props.t('username')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="password"
                            type={this.state.passVisibility ? 'text' : 'password'}
                            placeholder={this.props.t('password')}
                            component={this.renderPassword}
                        />
                        <button className={`w-5/6 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-purplish text-white`}>
                            {this.state.logingin ? loading('w-6 text-white') : this.props.t('enter')}
                        </button>
                    </form>
                    <button onClick={() => this.setState({ panel: 'sendcode' })} className={`w-5/6 mx-auto text-sm flex justify-center rounded-lg py-2 focus:outline-none mt-8 text-white`}>
                        {this.props.t('forgotPassword')}
                    </button>
                </>
            );
        } else if (this.state.panel === 'sendcode') {
            return (
                <>
                    <p className="text-center text-white"></p>
                    <form className="text-center" onSubmit={this.props.handleSubmit(this.sendCode)}>
                        <Field
                            name="IdNumer"
                            type="text"
                            placeholder={this.props.t('nationCode')}
                            component={this.renderInputs}
                        />
                        <button className={`w-5/6 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-purplish text-white`}>
                            {this.state.sendingCode ? loading('w-6 text-white') : this.props.t('sendVerificationCode')}
                        </button>
                    </form>

                    <button onClick={() => this.setState({ panel: 'login' })} className={`w-5/6 mx-auto text-sm flex justify-center rounded-lg py-2 focus:outline-none mt-8 text-white`}>
                        {this.state.logingin ? loading('w-6 text-white') : this.props.t('backToLogin')}
                    </button>
                </>
            );
        } else {
            return (
                <>
                    <form className="text-center" onSubmit={this.props.handleSubmit(this.confirm)}>
                        <Field
                            name="code"
                            type="text"
                            placeholder={this.props.t('sentCode')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="newPassword"
                            type="text"
                            placeholder={this.props.t('newPassword')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="confirmPassword"
                            type="text"
                            placeholder={this.props.t('confirmPassword')}
                            component={this.renderInputs}
                        />

                        <button className={`w-5/6 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-purplish text-white`}>
                            {this.state.reseting ? loading('w-6 text-white') : this.props.t('confirm')}
                        </button>
                    </form>
                    {/*<button className={`w-5/6 mx-auto text-sm flex justify-center rounded-lg py-2 focus:outline-none mt-8 text-white`}>*/}
                    {/*    {this.state.logingin ? loading('w-6 text-white') : 'کدی دریافت نکردید؟'}*/}
                    {/*</button>*/}
                    <button onClick={() => this.setState({ panel: 'login' })} className={`w-5/6 mx-auto text-sm flex justify-center rounded-lg py-2 focus:outline-none mt-8 text-white`}>
                        {this.state.logingin ? loading('w-6 text-white') : this.props.t('backToLogin')}
                    </button>
                </>
            );
        }
    }

    setShowLang = showLang => {
        this.setState({ showLang })
    }

    render() {
        return (
            <>
                <div onClick={() => this.setShowLang(false)} className="w-screen min-h-screen bg-black-blue pt-16">
                    <div className="w-full max-w-350 mx-auto">
                        <div className="text-center mb-8">
                            <img className="w-24 mx-auto mb-3" src={`${process.env.PUBLIC_URL}/icons/Logo.png`} alt="logo" />
                            {/* {logo('w-16 mb-3 text-purplish mx-auto')}
                            {process.env.REACT_APP_RAHE_DOOR === "true" ?
                                <img className="w-24 mx-auto mb-3" src={`${process.env.PUBLIC_URL}/icons/RD.png`} alt="logo" />
                                :
                                logo('w-24 mx-auto mb-3 text-purplish')
                            } */}
                            <span className="text-xl text-white">
                                {process.env.REACT_APP_RAHE_DOOR === "true" ? 'ورود به سامانه آموزش از راه دور خراسان رضوی' : this.props.t('enterVirgool')}
                            </span>
                        </div>
                        <div className="w-full py-16 text-center sm:border-2 sm:border-dark-blue rounded-lg">
                            {this.renderPanel()}
                        </div>
                        <SelectLang showLang={this.state.showLang} setShowLang={this.setShowLang} />
                    </div>
                </div>
                <span style={{position : "fixed" , bottom : 0 }} class="text-white mb-2 ml-3">process.env.REACT_APP_VERSION</span>
            </>
        );
    }

}

const validate = formValues => {
    const errors = {}
    if (!formValues.username) errors.username = true
    if (!formValues.password) errors.password = true
    if (!formValues.IdNumer) errors.IdNumer = true
    if (!formValues.code) errors.code = true
    if (formValues.newPassword != formValues.confirmPassword || !formValues.newPassword) errors.newPassword = true
    return errors
}

const formWrapped = reduxForm({
    form: 'login',
    validate
})(Login);

const cwrapped = connect(null, { login, logout, sendVerificationCode, forgotPassword , ChangePassword })(formWrapped)

export default withTranslation()(cwrapped)