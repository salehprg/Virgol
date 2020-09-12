import React from 'react';
import {Field, reduxForm} from "redux-form";
import { connect } from 'react-redux';
import { login } from "../../_actions/authActions";
import Fieldish from '../field/Fieldish';
import Passish from '../field/Passish';
import {loading} from '../../assets/icons';

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

            // const success = await this.props.login(formValues)

            // if (!success) this.setState({ logingin: false })
        }
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-black-blue py-16">
                <div className="w-full max-w-350 mx-auto">
                    <div className="text-center mb-8">
                        {/*{logo('w-16 mb-3 text-purplish mx-auto')}*/}
                        <img className="w-24 mx-auto mb-3" src={`${process.env.PUBLIC_URL}/icons/RD.png`} alt="logo" />
                        <span className="text-xl text-white">ورود به سامانه آموزش از راه دور خراسان رضوی</span>
                    </div>
                    <div className="w-full py-16 text-center sm:border-2 sm:border-dark-blue rounded-lg">
                    <form className="text-center" onSubmit={this.props.handleSubmit(this.onLogin)} >
                        <Field
                            name="username"
                            type="text"
                            placeholder="نام کاربری"
                            component={this.renderInputs}
                        />
                        <Field
                            name="password"
                            type={this.state.passVisibility ? 'text' : 'password'}
                            placeholder="گذرواژه"
                            component={this.renderPassword}
                        />
                        <button className={`w-5/6 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-purplish text-white`}>
                            {this.state.logingin ? loading('w-6 text-white') : 'ورود'}
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

export default connect(null)(formWrapped);