import React from "react";
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {home, key, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import RecentClass from "../RecentClass/RecentClass";
import { connect } from "react-redux";
import {GetActiveStream} from "../../../../_actions/streamActions"
import {GetIncommingNews} from "../../../../_actions/newsActions"
import {GetSchoolList} from "../../../../_actions/teacherActions"
import {GetMeetingList , GetRecentClass , CreatePrivateRoom , StartMeeting , EndMeeting , JoinMeeting , JoinPrivateRoom} from "../../../../_actions/meetingActions"
import {ShowSuccess} from '../../../../_actions/alertActions'
import Modal from "../../../modals/Modal";
import Fieldish from "../../../field/Fieldish";
import Select from "react-select";

class Home extends React.Component {

    state = {loading : false, newPrivateModal: false, 
            activeStream: { url: 'ewfewf' } , schoolOptions : [] , selectedSchool : {}}

    componentDidMount = async () =>{
            this.setState({loading: true})
            await this.props.GetActiveStream(this.props.user.token);
            await this.props.GetMeetingList(this.props.user.token);
            await this.props.GetIncommingNews(this.props.user.token);
            await this.props.GetRecentClass(this.props.user.token);
            this.setState({loading: false})

    }

    StatrMeeting = async(id) => {

        await this.props.StartMeeting(this.props.user.token , id)
        this.componentDidMount()
        this.render()
    }

    EndMeeting = async(bbbId) => {

        await this.props.EndMeeting(this.props.user.token , bbbId)
        this.componentDidMount()
        this.render()
    }

    JoinMeeting = async(id) => {

        await this.props.JoinMeeting(this.props.user.token , id)
        this.componentDidMount()
        this.render()
    }

    copyPrivateUrl = (bbbId) => {
        var rootURL = window.location.origin.toString()

        // navigator.clipboard.writeText(`${rootURL}/PrivateClass/${bbbId}`)
        this.copyToClipboard(`${rootURL}/PrivateClass/${bbbId}`);
        this.props.ShowSuccess(this.props.t('copied'))
    }

    copyToClipboard = (text) => {
        const elem = document.createElement('textarea');
        elem.value = text;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand('copy');
        document.body.removeChild(elem);
     }

    showPrivateModal = async () => {
        await this.props.GetSchoolList(this.props.user.token)

        var schools = [];
        this.props.schoolList.map(x => schools.push({value : x.id , label : x.schoolName}));

        this.setState({schoolOptions : schools ,  newPrivateModal: true});
    }

    hidePrivateModal = () => {
        this.setState({ newPrivateModal: false })
    }
    
    createPrivateRoom = async () => {
        await this.props.CreatePrivateRoom(this.state.privateName , this.state.selectedSchool.value)
        this.hidePrivateModal()
        this.setState({privateName : ""})
        this.componentDidMount()
        this.render()
    }

    handleSchoolSelect = (selectedSchool) => {
        this.setState({selectedSchool : selectedSchool})
    }

    render() {
        if(this.state.loading) return this.props.t('loading')
        return (
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 py-6">
                {this.state.newPrivateModal ?
                    <Modal cancel={this.hidePrivateModal}>
                        <div onClick={(e) => e.stopPropagation()} className="w-11/12 rounded-lg bg-bold-blue text-center max-w-500 p-8" style={{direction : "rtl"}}>
                            <div className="w-full" style={{direction : "rtl"}} >
                                <Select
                                    isMulti={false}
                                    className="w-5/6 px-4 py-2 my-4"
                                    value={this.state.selectedSchool}
                                    onChange={this.handleSchoolSelect}
                                    options={this.state.schoolOptions}
                                    placeholder={this.props.t('schoolServer')}
                                />
                            </div>
                            <input
                                value={this.state.privateName}
                                onChange={(e) => this.setState({privateName : e.target.value})}
                                className="w-5/6 px-4 py-2 rounded-lg bg-transparent border-2 border-dark-blue text-right text-white"
                                placeholder={this.props.t('privateClassName')}
                            />
                            <button onClick={() => this.createPrivateRoom()} className="px-6 my-4 py-1 rounded-lg text-white bg-greenish">{this.props.t('createClass')}</button>
                        </div>
                    </Modal>
                    :
                    null}
                <div className="col-span-1 flex flex-col items-center justify-between">
                    <Hero userInfo={this.props.user.userInformation}
                          userDetail={this.props.user.userDetail}
                          ShowServiceType = {true}/>

                    <RecentClass
                        onStart={(id) => this.StatrMeeting(id)}
                        joinList={false}
                        teacher={true}
                        newBtn={false}
                        classes={this.props.recentClass}
                        title={this.props.t('comingClasses')}
                        pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                    />
                    <RecentClass
                        onJoinPrivate = {(bbbId) => this.copyPrivateUrl(bbbId)}
                        onStart={(id) => this.JoinMeeting(id)}
                        onEnd={(bbbId) => this.EndMeeting(bbbId)}
                        joinList={true}
                        teacher={true}
                        newBtn={true}
                        btnAction={this.showPrivateModal}
                        classes={this.props.meetingList}
                        title={this.props.t('activeClasses')}
                        pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                    />
                </div>
                <div>
                <div>
                    {this.props.activeStream ? 
                    <div className="mb-4 flex flex-row-reverse items-center justify-evenly">
                        <p className="text-white">{this.props.activeStream.streamName}</p>
                        <Link 
                            className="py-2 px-6 rounded-lg bg-greenish text-white" 
                            to={`/stream/${this.props.activeStream.joinLink}`}>
                            پیوستن به همایش
                        </Link>
                    </div> 
                    : 
                    null
                    }
                    <Feed
                    news={this.props.inNews}
                    title={this.props.t('studentNews')}
                    pos="col-span-1"
                />
                </div> 
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , meetingList : state.meetingData.meetingList , 
                                        recentClass : state.meetingData.recentClass ,
                                        inNews : state.newsData.incomeNews ,
                                        activeStream : state.streamData.activeStream,
                                        schoolList : state.teacherData.schoolList}
}
const cwrapped = connect(mapStateToProps, { GetMeetingList , GetRecentClass , StartMeeting ,
    EndMeeting , JoinMeeting , GetIncommingNews , CreatePrivateRoom 
   , JoinPrivateRoom , ShowSuccess , GetActiveStream , GetSchoolList})(Home);

export default withTranslation()(cwrapped);