import React from "react";
import {authenticationService} from '../../_Services/AuthenticationService'
import { Spinner } from "react-bootstrap";
import { Switch, Route } from "react-router";

class VerifyCode extends React.Component {
    constructor (props)
    {
        super(props);
        this.state ={VerifyCode : "" , Loading : false };
        
    }

     forgotPassword = async () =>{
        this.setState({Loading : true});
        const resul = await authenticationService.ConfirmCode(this.props.Mellicode , this.state.VerifyCode);
        console.log(resul);
        this.setState({Loading : false});
    }

    render() {
        return (
            <div className="flex flex-col items-center">
                <span className="font-vb text-pri text-4xl mb-8">تایید کد</span>
                <form onSubmit={this.forgotPassword}>
                    <input
                        className="rtl w-full border-b border-box my-4 py-1 focus:outline-none"
                        type="number"
                        placeholder="کد ارسال شده به تلفن همراه"
                        onChange = { e => this.setState({ VerifyCode : e.target.value }) }
                    />
                    <div className="flex flex-row justify-center mt-8">
                    {(!this.state.Loading ?
                        <input
                            className="bg-pri px-12 py-1 text-white rounded-lg focus:outline-none focus:shadow-outline"
                            type="submit"
                            value="تایید"
                        />
                    :
                        <Spinner animation="border" variant="primary" />
                    )}
                    </div>
                </form>
                <span className="mt-12 text-center text-lg text-box">کد تایید به شماره تلفن شما ارسال شد</span>
            </div>
        );
    }

}

export default VerifyCode;