import React from "react";
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {loading} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import { connect } from "react-redux";
import {GetActiveStream} from "../../../../_actions/streamActions"
import {GetIncommingNews } from "../../../../_actions/newsActions"
import {GetRecentClass , JoinMeeting } from "../../../../_actions/meetingActions"
import RecentClass from "../RecentClass/RecentClass"

class Home extends React.Component {

    state = {loading : false, activeStream: { url: 'ewfewf' }}

    componentDidMount = async () =>{
        this.setState({loading: true})
        await this.props.GetActiveStream(this.props.user.token);
        await this.props.GetIncommingNews(this.props.user.token);
        await this.props.GetRecentClass(this.props.user.token);
        this.setState({loading: false})
    }

    JoinMeeting = async(id) => {

        await this.props.JoinMeeting(this.props.user.token , id)
        this.componentDidMount()
        this.render()
    }
    
    render() {
        if(this.state.loading) return (<div className="tw-text-center tw-bg-dark-blue tw-w-full tw-h-screen">{loading('centerize tw-text-grayish tw-w-12')}</div>)
        return (
            <div className="tw-grid sm:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4 tw-py-6">
                <div className="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
                    <Hero userInfo={this.props.user.userInformation}
                          userDetail={this.props.user.userDetail}
                          userTitle={this.props.user.userDetail.schooltypeName}
                          ShowServiceType = {false}/>
                    <RecentClass
                        onStart={(id) => this.JoinMeeting(id)}
                        joinList={true}
                        classes={this.props.recentClass}
                        title={this.props.t('activeClasses')}
                        pos="tw-row-start-4 sm:tw-row-start-auto tw-col-span-2 tw-row-span-2"
                    />
                </div>
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
                    title={this.props.t('studentsNews')}
                    pos="tw-col-span-1"
                />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , 
            inNews : state.newsData.incomeNews, 
            recentClass : state.meetingData.recentClass,
            activeStream : state.streamData.activeStream }
}

const cwrapped = connect(mapStateToProps, {GetIncommingNews , GetRecentClass , JoinMeeting , GetActiveStream })(Home);

export default withTranslation()(cwrapped);