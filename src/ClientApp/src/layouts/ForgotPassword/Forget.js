import React from "react";
import {authenticationService} from '../../_Services/AuthenticationService'
import { Spinner } from "react-bootstrap";
import SendCode from './SendCode'
import VerifyCode from './VerifyCode'

class Forget extends React.Component {
    constructor (props)
    {
        super(props);
        this.state ={activePanel : "SendCode" , MelliCode : "" , Loading : false };
        
    }

     forgotPassword = async () =>{
        this.setState({Loading : true});
        await authenticationService.SendCode(this.state.MelliCode);
        this.setState({Loading : false});
    }

    GotoVerify = (mellicode) =>{
        this.setState({activePanel : "VerifyCode"});
        this.setState({MelliCode : mellicode});
    }

    renderPanel = () => {
        switch (this.state.activePanel) {
            case "SendCode": return <SendCode Verify={this.GotoVerify} />;
            case "VerifyCode": return <VerifyCode Mellicode={this.state.MelliCode}/>;
            default: return null;
        }
    }

    render() {
        return (
            this.renderPanel()
        );
    }

}

export default Forget;