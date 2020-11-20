import React from "react";
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {home, key, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import { connect } from "react-redux";
import {GetIncommingNews } from "../../../../_actions/newsActions"
import {GetRecentClass , JoinMeeting } from "../../../../_actions/meetingActions"
import RecentClass from "../RecentClass/RecentClass"

class Home extends React.Component {

    state = {loading : false, activeStream: { url: 'ewfewf' }}

    componentDidMount = async () =>{
        this.setState({loading: true})
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
        if(this.state.loading) return this.props.t('loading')
        return (
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 py-6">
                <div className="col-span-1 flex flex-col justify-between">
                    <Hero userInfo={this.props.user.userInformation}
                          userDetail={this.props.user.userDetail}
                          userTitle={this.props.user.userDetail.schooltypeName}
                          ShowServiceType = {false}/>
                    <RecentClass
                        onStart={(id) => this.JoinMeeting(id)}
                        joinList={true}
                        classes={this.props.recentClass}
                        title={this.props.t('activeClasses')}
                        pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                    />
                </div>
                <div>
                    {this.state.activeStream ? 
                    <div className="mb-4 flex flex-row-reverse items-center justify-evenly">
                        <p className="text-white">همایش در حال برگزاری</p>
                        <Link className="py-2 px-6 rounded-lg bg-greenish text-white" to={`/stream/${this.state.activeStream.url}`}>پیوستن به همایش</Link>
                    </div> 
                    : 
                    null
                    }
                    <Feed
                    news={this.props.inNews}
                    title={this.props.t('studentsNews')}
                    pos="col-span-1"
                />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , inNews : state.newsData.incomeNews, recentClass : state.meetingData.recentClass }
}

const cwrapped = connect(mapStateToProps, {GetIncommingNews , GetRecentClass , JoinMeeting  })(Home);

export default withTranslation()(cwrapped);