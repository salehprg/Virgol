import React, { useState } from "react";
import { connect } from "react-redux";
import {SetMeetingService}  from '../../../../_actions/teacherActions'

class Hero extends React.Component {

    state = {serviceType : 'bbb'}

    componentDidMount = () => {
        if(this.props.ShowServiceType)
        {
            this.setState({serviceType : this.props.userDetail.userDetail.meetingService})
        }
    }

    changeService = async (service) => {
        this.setState({serviceType : service})
        await this.props.SetMeetingService(this.props.user.token , service)
    }

    render() {
        const props = this.props;

        return (
            <div className="relative w-full text-center rounded-xl py-4 px-6">
                {/*<Particles className="absolute top-0 bottom-0 right-0 left-0" params={particles} />*/}
                <p className="text-3xl text-white my-2">{props.userInfo.firstName} {props.userInfo.lastName}</p>
                <a href="https://webmail.legace.ir/" className="text-md text-white my-2" style={{color : "#60b5ff"}}>{props.userInfo.email}</a>
                {(props.adminTitle ?
                    <p className="text-white my-2">{props.adminTitle}</p>
                : ""
                )}

                {(props.managerTitle ?
                    <p className="text-white my-2">{props.managerTitle}</p> : "")}

                {(props.userTitle ?
                    <>
                        <p className="text-white my-2">{` مدرسه ${props.userTitle} ${props.userDetail.userDetail.school.schoolName}`}</p> 
                    </>
                    : "")}
                {(this.props.ShowServiceType ?
                <div className="flex flex-row items-center my-2 w-full justify-center">
                    <span onClick={() => this.changeService('bbb')} className={`mx-2 cursor-pointer px-3 py-1 border-2 rounded-md ${this.state.serviceType === 'bbb' ? 'border-blue-500 text-blue-500' : 'border-grayish text-grayish'}`}>BigBlueButton</span>
                    <span onClick={() => this.changeService('adobe')} className={`mx-2 cursor-pointer px-3 py-1 border-2 rounded-md ${this.state.serviceType === 'adobe' ? 'border-greenish text-greenish' : 'border-grayish text-grayish'}`}>Adobe Connect</span>
                </div>
                : null)}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {user: state.auth.userInfo}
}

const cwrapped = connect(mapStateToProps, { SetMeetingService})(Hero);

export default (cwrapped);