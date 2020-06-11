import React from "react";
import './Login.css';

import { Spinner } from "react-bootstrap";
import {authenticationService} from '../../_Services/AuthenticationService'
import { Link } from "@material-ui/core";

class Login extends React.Component {

    constructor (props)
    {
        super(props);
        this.state ={Username : "" , Password : "" , Loading : false};
        
    }

    Login = async (event) =>{

        this.setState({Loading : true});
        event.preventDefault();
        let result = await authenticationService.login(this.state.Username , this.state.Password);
    
        this.setState({Loading : false});
      }

    render() {
        return (
            <div className="login-background">
                <div className="login-big-box">
                    <div className="login-image-side">
                        <div className="login-image-side-content">
                            <h1>سیستم آموزش مجازی</h1>
                                <Link href="/SignUp" >
                                    {"ثبت نام"}
                                </Link>
                        </div>
                    </div>
                    <div className="login-small-box">
                        <div className="login-small-box-content">
                            <div className="welcome">
                                <span>خوش اومدی</span>
                            </div>
                            {(!this.state.Loading ?
                            <form noValidate onSubmit={this.Login}>
                                <input
                                    type="text"
                                    placeholder="نام کاربری"
                                    onChange = { e => this.setState({ Username : e.target.value }) }
                                />

                                <input
                                    type="password"
                                    placeholder="رمز عبور"
                                    onChange = { e => this.setState({ Password : e.target.value }) }
                                />

                                <div className="submit-forgot-container">
                                    <input type="submit" value="ورود" />
                                    <a href="#">
                                        فراموشی رمز عبور
                                    </a>
                                </div>
                            </form>
                            :
                            <Spinner animation="border" variant="primary" />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Login;