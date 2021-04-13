import React from "react";
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {loading} from "../../../../assets/icons";
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
import {styles} from '../../../../selectStyle'
import QuestionModal from "../../../modals/QuestionModal";
import {getDayOfWeek} from "../../../Utilities/TmeHelper"

class Home extends React.Component {

    state = {loading : false, newPrivateModal: false, outOfTime : false, startClassId : 0 , outOfJoinTime : false, joinClassId : 0 ,
            activeStream: { url: 'ewfewf' } , schoolOptions : [] , selectedSchool : {} , privateName : ''}

    componentDidMount = async () =>{
            this.setState({loading: true})
            await this.props.GetActiveStream(this.props.user.token);
            await this.props.GetMeetingList(this.props.user.token);
            await this.props.GetIncommingNews(this.props.user.token);
            await this.props.GetRecentClass(this.props.user.token);
            this.setState({loading: false})
    }
    
    getRemainingTime = (start , classInfo) =>
    {
        var time = new Date();
        var currentTime = time.getHours();
        currentTime += time.getMinutes() / 60;
        
        var dayOffset = 0;
        var todayNum = getDayOfWeek()
        if(classInfo.dayType > todayNum)
            dayOffset = 24;

        var result = (currentTime - start - dayOffset) * 60;

        return result;
    }
    StatrMeeting = async(id) => {
        var recClass = this.props.recentClass.find(x => x.id == id);
        this.setState({recClass : recClass})
        var remainTime = this.getRemainingTime(recClass.startHour , recClass)

        if(remainTime <= -15)
        {
            this.setState({outOfTime : true , startClassId : id , remainTime : remainTime * (-1)});
        }
        else
        {
            this.reqStartMeeting(id)
        }
    }
    reqStartMeeting = async(id) => {

        this.setState({loading : true , outOfTime : false})

        await this.props.StartMeeting(this.props.user.token , id)
        this.setState({loading : false});

        this.componentDidMount()
        this.render()
    }

    EndMeeting = async(bbbId) => {

        this.setState({loading : true})
        await this.props.EndMeeting(this.props.user.token , bbbId)
        this.componentDidMount()
        this.render()
    }


    JoinMeeting = async(id) => {
        var recClass = this.props.recentClass.find(x => x.id == id);
        if(!recClass)
            recClass = this.props.meetingList.find(x => x.id == id);

        this.setState({recClass : recClass})
        var remainTime = this.getRemainingTime(recClass.startHour , recClass)
        if(remainTime < -15)
        {
            this.setState({outOfJoinTime : true , joinClassId : id , remainJoinTime : remainTime * (-1)});
        }
        else
        {
            this.reqJoinMeeting(id)
        }

    }
    reqJoinMeeting = async(id) => {
        this.setState({loading : true , outOfJoinTime : false})
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

        this.setState({schoolOptions : schools  , selectedSchool : schools[0],  newPrivateModal: true});

    }

    hidePrivateModal = () => {
        this.setState({ newPrivateModal: false })
    }
    
    createPrivateRoom = async () => {
        this.setState({loading : true})
        
        await this.props.CreatePrivateRoom(this.props.user.token , this.state.privateName , this.state.selectedSchool.value)
        this.hidePrivateModal()
        this.setState({privateName : ""})
        this.componentDidMount()
        this.render()
    }

    handleSchoolSelect = (selectedSchool) => {
        this.setState({selectedSchool : selectedSchool})
    }

    getTimeFormatted = (time) => {
        const h = Math.floor(time / 60);
        const m = Math.floor(time % 60);
        let ftime = '';
        if (h > 0) ftime = `${h} ساعت`
        if (m > 0) ftime = ftime + ` ${m} دقیقه`
        return ftime;
    }

    render() {
        if(this.state.loading) return (<div className="tw-text-center tw-bg-dark-blue tw-w-full tw-h-screen">{loading('centerize tw-text-grayish tw-w-12')}</div>)
        if(this.state.outOfTime) return <QuestionModal 
                                            title={"قصد ایجاد کلاس در خارج از موعد آن را دارید. زمان باقی مانده تا شروع کلاس " + this.state.recClass.orgLessonName + " : " + this.getTimeFormatted(this.state.remainTime)}
                                            confirm={() => this.reqStartMeeting(this.state.startClassId)}
                                            cancel={() => this.setState({ outOfTime: false})}>
                                        </QuestionModal>
        if(this.state.outOfJoinTime) return <QuestionModal 
                                            title={"قصد ورود کلاس در خارج از موعد آن را دارید. زمان باقی مانده تا شروع کلاس " + this.state.recClass.orgLessonName + " : " + this.getTimeFormatted(this.state.remainJoinTime)}
                                            confirm={() => this.reqJoinMeeting(this.state.joinClassId)}
                                            cancel={() => this.setState({ outOfJoinTime: false})}>
                                        </QuestionModal>

        return (
            <div className="tw-grid sm:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4 tw-py-6">
                {this.state.newPrivateModal ?
                    <Modal cancel={this.hidePrivateModal}>
                        <div onClick={(e) => e.stopPropagation()} className="tw-w-11/12 tw-rounded-lg tw-bg-bold-blue tw-text-center tw-max-w-500 tw-p-8" style={{direction : "rtl"}}>
                            <div className="tw-w-full" style={{direction : "rtl"}} >
                                <Select
                                    styles={styles}
                                    isMulti={false}
                                    className="tw-w-5/6 tw-px-4 tw-py-2 tw-my-4"
                                    value={this.state.selectedSchool}
                                    onChange={this.handleSchoolSelect}
                                    options={this.state.schoolOptions}
                                    placeholder={this.props.t('schoolServer')}
                                />
                            </div>
                            <input
                                value={this.state.privateName}
                                onChange={(e) => this.setState({privateName : e.target.value})}
                                className="tw-w-5/6 tw-px-4 tw-py-2 tw-rounded-lg tw-bg-transparent tw-border-2 tw-border-dark-blue tw-text-right tw-text-white"
                                placeholder={this.props.t('privateClassName')}
                            />
                            <button onClick={() => this.createPrivateRoom()} className="tw-px-6 tw-my-4 tw-py-1 tw-rounded-lg tw-text-white tw-bg-greenish">{this.props.t('createClass')}</button>
                        </div>
                    </Modal>
                    :
                    null}
                <div className="tw-col-span-1 tw-flex tw-flex-col tw-items-center tw-justify-between">
                    <Hero userInfo={this.props.user.userInformation}
                          userDetail={this.props.user.userDetail}
                          ShowServiceType = {true}/>

                    <RecentClass
                        onJoin={(id) => this.JoinMeeting(id)}
                        onStart={(id) => this.StatrMeeting(id)}
                        joinList={false}
                        teacher={true}
                        newBtn={false}
                        classes={this.props.recentClass}
                        title={this.props.t('comingClasses')}
                        pos="tw-row-start-4 sm:tw-row-start-auto tw-col-span-2 tw-row-span-2"
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
                        pos="tw-row-start-4 sm:tw-row-start-auto col-span-2 tw-row-span-2"
                    />
                </div>
                <div>
                <div>
                    {this.props.activeStream ? 
                    <div className="tw-mb-4 tw-flex tw-flex-row-reverse tw-items-center tw-justify-evenly">
                        <p className="tw-text-white">{this.props.activeStream.streamName}</p>
                        <Link 
                            className="tw-link tw-py-2 tw-px-6 tw-rounded-lg tw-bg-greenish tw-text-white" 
                            to={`/stream`}>
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