import React from "react";
import {authenticationService} from '../../_Services/AuthenticationService'
import { Spinner } from "react-bootstrap";

class SendCode extends React.Component {
    constructor (props)
    {
        super(props);
        this.state ={MelliCode : "" , Loading : false };
        
    }

    handleSendcode = async () =>{
        this.setState({Loading : true});
        const result = await authenticationService.SendCode(this.state.MelliCode);
        console.log(result);
        if(result == true)
        {
            this.props.Verify(this.state.MelliCode);
        }
        this.setState({Loading : false});
    }

    render() {
        return (
            <div className="flex flex-col items-center">
                <span className="font-vb text-pri text-4xl mb-8">فراموشی رمز</span>
                <form >
                    <input
                        className="rtl w-full border-b border-box my-4 py-1 focus:outline-none"
                        type="number"
                        placeholder="کد ملی"
                        onChange = { e => this.setState({ MelliCode : e.target.value }) }
                    />
                    <div className="flex flex-row justify-center mt-8">
                    {(!this.state.Loading ?
                        <input
                            className="bg-pri px-12 py-1 text-white rounded-lg focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => this.handleSendcode()}
                            value="ارسال کد"
                        />
                    :
                        <Spinner animation="border" variant="primary" />
                    )}
                    </div>
                </form>
                <span className="mt-12 text-center text-lg text-box">تعداد دفعات مجاز ارسال کد سه بار در هر سی دقیقه</span>
            </div>
        );
    }

}

export default SendCode;