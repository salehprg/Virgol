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
import { localizer } from '../../assets/localizer'
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import './rememberStyles.css'

class Login extends React.Component {

    state = {
        passVisibility: false,
        logingin: false,
        panel: 'login',
        sendingCode: false,
        reseting: false,
        IdNumer: null,
        showLang: false,
        check: false,
        captchaloaded : false
    }

    componentDidMount() {
        this.props.logout() 

        loadCaptchaEnginge(4); 
        console.log("Load completed");

        if(localStorage.getItem('remember') !== 'false' && this.props.user){
            this.setState({logingin: true})

            if(localStorage.getItem('prefLang') === null){
                localStorage.setItem('prefLang' , 'fa')
            }

            this.onLogin({username : this.props.user.userInformation.userName ,
                        password: this.props.user.userSituation.substring(0 , (this.props.user.userSituation.length)/2)})

        }
    }

    renderInputs = ({ input, meta, type, placeholder , id }) => {
        return (
            <Fieldish   
                id={id}
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="ltr"
                placeholder={placeholder}
                extra="tw-w-5/6 tw-my-4"
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
                extra="tw-w-5/6 tw-my-4"
                visible={this.state.passVisibility}
                onChange={() => this.setState({ passVisibility: !this.state.passVisibility})}
            />
        );
    }

    onLogin = async formValues => {
        if (!this.state.logingin) {
            let user_captcha_value = document.getElementById('user_captcha_input').value;

            if (validateCaptcha(user_captcha_value)==true) {
                this.setState({logingin: true})

                if(this.state.check){
                    localStorage.setItem('remember' , this.state.check)
                }
                else{
                    localStorage.setItem('remember' , false)
                }

                const success = await this.props.login(formValues)

                if (!success) 
                {
                    this.setState({ logingin: false })
                    loadCaptchaEnginge(4); 
                }
            }
            else {
                alert('کد امنیتی صحیح نمیباشد');
            }
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
                   
            const changeVal = () =>{
                this.setState({check : !this.state.check})
            }
            return (
                <>
                    <form onSubmit={this.props.handleSubmit(this.onLogin)} >
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
                        <a onClick={() => this.setState({ panel: 'sendcode' })} href="#" className={`tw-w-5/6 tw-cursor-pointer hover:tw-no-underline  tw-text-sm tw-flex tw-justify-center tw-rounded-lg tw-ml-20 tw-pb-0 focus:tw-outline-none tw-mt-4 tw-text-white tw-text-right`}>
                            {this.props.t('forgotPassword')} 
                        </a>

                        <label className="switch">
                            <input type="checkbox" value={this.state.check} onClick={changeVal}/>
                            <span className="slider round"></span>
                        </label>
                        <label className="tw-text-white tw-p-4">{this.props.t('remember')}</label>

                        <div className="d-flex justify-content-center">
                            <LoadCanvasTemplate reloadText=" " reloadColor="black"/>   
                        </div>

                        <button type="button" onClick={() => loadCaptchaEnginge(4)} className={`tw-w-1/5 tw-mx-auto tw-flex tw-justify-center tw-rounded-lg tw-py-1 focus:tw-outline-none focus:tw-shadow-outline tw-my-4 tw-text-white`}>
                            کد جدید
                        </button>

                        <Field
                            id="user_captcha_input"
                            name="captcha"
                            type='text'
                            placeholder={this.props.t('captcha')}
                            component={this.renderInputs}
                        />
                        <span className="d-block text-white">کد امنیتی به بزرگ و کوچکی حروف حساس میباشد</span>


                        <button type="submit" className={`tw-w-5/6 tw-mx-auto tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none focus:tw-shadow-outline tw-my-8 tw-bg-purplish tw-text-white`}>
                            {this.state.logingin ? loading('tw-w-6 tw-text-white') : this.props.t('enter')}
                        </button>
                        {
                            this.props.effort >= 3 ?
                            <div>
                                <div>Captcha</div>
                            </div>
                            :
                            null
                        }
                    </form>
                    
                </>
            );
        } else if (this.state.panel === 'sendcode') {
            return (
                <>
                    <p className="tw-text-center tw-text-white"></p>
                    <form className="tw-text-center" onSubmit={this.props.handleSubmit(this.sendCode)}>
                        <Field
                            name="IdNumer"
                            type="text"
                            placeholder={this.props.t('username')}
                            component={this.renderInputs}
                        />
                        <button className={`tw-w-5/6 tw-mx-auto tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none focus:tw-shadow-outline tw-my-4 tw-bg-purplish tw-text-white`}>
                            {this.state.sendingCode ? loading('tw-w-6 tw-text-white') : this.props.t('sendVerificationCode')}
                        </button>
                    </form>

                    <button onClick={() => this.setState({ panel: 'login' })} className={`tw-w-5/6 tw-mx-auto tw-text-sm tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none tw-mt-8 tw-text-white`}>
                        {this.state.logingin ? loading('tw-w-6 tw-text-white') : this.props.t('backToLogin')}
                    </button>
                </>
            );
        } else {
            return (
                <>
                    <form className="tw-text-center" onSubmit={this.props.handleSubmit(this.confirm)}>
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

                        <button className={`tw-w-5/6 tw-mx-auto tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none focus:tw-shadow-outline tw-my-8 tw-bg-purplish tw-text-white`}>
                            {this.state.reseting ? loading('tw-w-6 tw-text-white') : this.props.t('confirm')}
                        </button>
                    </form>
                    {/*<button className={`tw-w-5/6 tw-mx-auto tw-text-sm tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none tw-mt-8 tw-text-white`}>*/}
                    {/*    {this.state.logingin ? loading('tw-w-6 tw-text-white') : 'کدی دریافت نکردید؟'}*/}
                    {/*</button>*/}
                    <button onClick={() => this.setState({ panel: 'login' })} className={`tw-w-5/6 tw-mx-auto tw-text-sm tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none tw-mt-8 tw-text-white`}>
                        {this.state.logingin ? loading('tw-w-6 tw-text-white') : this.props.t('backToLogin')}
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
                    <div onClick={() => this.setShowLang(false)} className="tw-w-screen tw-min-h-screen tw-bg-black-blue tw-pt-16">
                        <div className="tw-w-full tw-max-w-350 tw-mx-auto">
                            <div className="tw-text-center tw-mb-8">
                                {/* <img className="tw-w-24 tw-mx-auto tw-mb-3" src={`${process.env.PUBLIC_URL}/icons/Logo.png`} alt="logo" /> */}
                                <img className="tw-w-24 tw-mx-auto tw-mb-3" src={localizer.getLogo(window.location.href)} alt="logo" />
                                {/* {logo('tw-w-16 tw-mb-3 tw-text-purplish tw-mx-auto')}
                                {process.env.REACT_APP_RAHE_DOOR === "true" ?
                                    <img className="tw-w-24 tw-mx-auto tw-mb-3" src={`${process.env.PUBLIC_URL}/icons/RD.png`} alt="logo" />
                                    :
                                    logo('tw-w-24 tw-mx-auto tw-mb-3 tw-text-purplish')
                                } */}
                                <span className="tw-text-xl tw-text-white">
                                    {/* {process.env.REACT_APP_ENTER_TEXT} */}
                                    {localizer.getTitle(window.location.href)}
                                </span>
                                

                            </div>
                            <div className="tw-w-full tw-py-6 tw-text-center sm:tw-border-2 sm:tw-border-dark-blue tw-rounded-lg">
                                <SelectLang showLang={this.state.showLang} setShowLang={this.setShowLang} className="tw-pb-6" />
                                {this.renderPanel()}
                            </div>
                            
                        </div>
                    </div>
                    <span style={{position : "fixed" , bottom : 0 }} className="tw-text-white tw-mb-2 tw-ml-3">process.env.REACT_APP_VERSION</span>
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

const mapStateToProps = state => {
    return {effort: state.auth.loginEffort , user : state.auth.userInfo }
}


const cwrapped = connect(mapStateToProps, { login, logout, sendVerificationCode, forgotPassword , ChangePassword })(formWrapped)

export default withTranslation()(cwrapped)