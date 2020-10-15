import React from "react";
import { withTranslation } from 'react-i18next'
import { Route, Switch } from "react-router-dom";
import { loading } from "../../assets/icons";
import history from '../../history'
import ParticipantList from './ParticipantList'
import SubmitReview from './SubmitReview'

class MeetingResponse extends React.Component {

    state = { userType: 0 , redirectUrl : ""}

    componentDidMount = async () => {
        var userType = localStorage.getItem("userType")

        if(userType == 1)
        {
            history.push("/s/dashboard")
        }
        else if(userType == 3)
        {
            history.push("/ParticipantInfo/" + this.props.match.params.id)
        }
        else if(userType == 4)
        {
            history.push("/m/tracker")
        }
    }

    render() {
        return (
            <div>
                {this.props.t('forwarding')}
            </div>
        )
    }

}

export default withTranslation()(MeetingResponse);