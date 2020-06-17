import React from "react";
import './Login.css';
import Forget from '../ForgotPassword/Forget'

import { Spinner } from "react-bootstrap";
import {authenticationService} from '../../_Services/AuthenticationService'
import { Link } from "@material-ui/core";

class Login extends React.Component {

    constructor (props)
    {
        super(props);
        this.state ={Username : "" , Password : "" , Loading : false , panel: 'login'};
        
    }

    Login = async (event) =>{

        this.setState({Loading : true});
        event.preventDefault();
        let result = await authenticationService.login(this.state.Username , this.state.Password);
    
        this.setState({Loading : false});
      }

    onForgotClicked = () => {
        this.setState({ panel: 'forgot' })
    }

    renderContent = () => {
        if (this.state.panel === 'login') {
            return (
                <div className="flex flex-col items-center">
                    <span className="font-vb text-pri text-4xl mb-8">خوش اومدی</span>
                    {(!this.state.Loading ?
                        <form noValidate onSubmit={this.Login}>
                            <input
                                className="rtl w-full border-b border-box my-4 py-1 focus:outline-none"
                                type="text"
                                placeholder="نام کاربری"
                                onChange = { e => this.setState({ Username : e.target.value }) }
                            />

                            <input
                                className="rtl w-full border-b border-box my-4 py-1 focus:outline-none"
                                type="password"
                                placeholder="رمز عبور"
                                onChange = { e => this.setState({ Password : e.target.value }) }
                            />

                            <div className="submit-forgot-container">
                                <input type="submit" value="ورود" />
                                <a href="#" onClick={this.onForgotClicked}>فراموشی رمز عبور</a>
                            </div>
                        </form>
                        :
                        <Spinner animation="border" variant="primary" />
                    )}
                </div>
            );
        }
        else {
            return (
                <Forget />
            );
        }
    }


      render() {
        return (
            <div className="bg-mbg w-screen min-h-screen flex justify-center sm:items-center">
                <div className="h-600 min-h-screen sm:min-h-0 sm:w-2/3 md:w-3/4 w-full bg-white flex flex-col md:flex-row justify-center items-center">
                    <div
                        className="w-full md:w-1/3 h-1/4 md:h-full order-2 md:order-1 bg-cover flex flex-col justify-center items-center"
                        style={{backgroundImage : 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(images/login.jpg)'}}
                    >
                        <h1 className="text-white text-center font-vb text-3xl sm:text-4xl">سیستم آموزش مجازی</h1>
                        <Link href="/SignUp" className="bg-pri text-white px-16 py-2 rounded-lg mt-6">ثبت نام</Link>
                    </div>

                    <div className="w-3/4 sm:w-full md:w-2/3 h-3/4 md:h-full order-1 md:order-2 flex justify-center items-center">
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        )
    }

}

export default Login;