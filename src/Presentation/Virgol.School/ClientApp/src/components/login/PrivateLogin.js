import React from 'react';
import { withTranslation } from 'react-i18next'
import {Field, reduxForm} from "redux-form";
import { connect } from 'react-redux';
import { login } from "../../_actions/authActions";
import { JoinPrivateRoom } from "../../_actions/meetingActions";
import Fieldish from '../field/Fieldish';
import Passish from '../field/Passish';
import {loading, logo} from '../../assets/icons';

class PrivateLogin extends React.Component {

    state = {
        passVisibility: false,
        logingin: false
    }

    renderInputs = ({ input, meta, type, placeholder }) => {
        return (
            <Fieldish
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
            this.setState({logingin: true})
            
            var token = await this.props.login(formValues , false)
            await this.props.JoinPrivateRoom(token , this.props.match.params.id)
            this.setState({logingin: false})
        }
    }

    render() {
        return (
            <div className="tw-w-screen tw-min-h-screen tw-bg-black-blue tw-py-16">
                <div className="tw-w-full tw-max-w-350 tw-mx-auto">
                    <div className="tw-text-center tw-mb-8">
                        {/*{logo('tw-w-16 tw-mb-3 tw-text-purplish tw-mx-auto')}*/}
                        {process.env.REACT_APP_RAHE_DOOR === "true" ?
                            <img className="tw-w-24 tw-mx-auto tw-mb-3" src={`${process.env.PUBLIC_URL}/icons/RD.png`} alt="logo" />
                            :
                            logo('tw-w-24 tw-mx-auto tw-mb-3 tw-text-purplish')
                        }
                        <span className="tw-text-xl tw-text-white">{this.props.t('enterPrivateClass')}</span>
                    </div>
                    <div className="tw-w-full tw-py-16 tw-text-center sm:tw-border-2 sm:tw-border-dark-blue tw-rounded-lg">
                    <form className="tw-text-center" onSubmit={this.props.handleSubmit(this.onLogin)} >
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
                        <button className={`tw-w-5/6 tw-mx-auto tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none focus:tw-shadow-outline tw-my-8 tw-bg-purplish tw-text-white`}>
                            {this.state.logingin ? loading('tw-w-6 tw-text-white') : this.props.t('enter')}
                        </button>
                    </form>
                    </div>
                </div>
            </div>
        );
    }

}

const validate = formValues => {
    const errors = {}
    if (!formValues.username) errors.username = true
    if (!formValues.password) errors.password = true
    return errors
}

const formWrapped = reduxForm({
    form: 'private-login',
    validate
})(PrivateLogin);

const cwrapped = connect(null , {JoinPrivateRoom , login} )(formWrapped);

export default withTranslation()(cwrapped);