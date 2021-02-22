import React  from "react";
import { connect } from "react-redux";
import {SetMeetingService}  from '../../../../_actions/teacherActions'

class Hero extends React.Component {

    state = {serviceType : 'bbb'}

    componentDidMount = () => {
        if(this.props.ShowServiceType)
        {
            this.setState({serviceType : this.props.user.userDetail.userDetail.meetingService})
        }


    }

    changeService = async (service) => {
        this.setState({serviceType : service})
        await this.props.SetMeetingService(this.props.user.token , service)
    }

    render() {
        const props = this.props;

        return (
            <div className="tw-relative tw-w-full tw-text-center tw-rounded-xl tw-py-4 tw-px-6">
                {/*<Particles className="tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-left-0" params={particles} />*/}
                <p className="tw-text-3xl tw-text-white tw-my-2">{props.userInfo.firstName} {props.userInfo.lastName}</p>
                <p className="tw-text-md tw-text-white tw-my-2" style={{color : "#60b5ff"}}>{props.userInfo.melliCode}</p>
                {(props.adminTitle ?
                    <p className="tw-text-white tw-my-2">{props.adminTitle}</p>
                : ""
                )}

                {(props.managerTitle ?
                    <p className="tw-text-white tw-my-2" dir="rtl">{props.managerTitle}</p> : "")}

                {(props.userTitle ?
                    <>
                        <p className="tw-text-white tw-my-2">{` مدرسه ${props.userTitle} ${props.userDetail.userDetail.school.schoolName}`}</p> 
                    </>
                    : "")}
                {(this.props.ShowServiceType ?
                <div className="tw-flex tw-flex-row tw-items-center tw-my-2 tw-w-full tw-justify-center">
                    <span onClick={() => this.changeService('bbb')} className={`tw-mx-2 tw-cursor-pointer tw-px-3 tw-py-1 tw-border-2 tw-rounded-md ${this.state.serviceType === 'bbb' ? 'tw-border-blue-500 tw-text-blue-500' : 'tw-border-grayish tw-text-grayish'}`}>BigBlueButton</span>
                    <span onClick={() => this.changeService('adobe')} className={`tw-mx-2 tw-cursor-pointer tw-px-3 tw-py-1 tw-border-2 tw-rounded-md ${this.state.serviceType === 'adobe' ? 'tw-border-greenish tw-text-greenish' : 'tw-border-grayish tw-text-grayish'}`}>Adobe Connect</span>
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