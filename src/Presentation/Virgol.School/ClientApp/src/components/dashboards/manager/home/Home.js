import React from "react";
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {home, key, loading, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import { connect } from "react-redux";
import {GetActiveStream} from "../../../../_actions/streamActions"
import {getManagerDashboardInfo} from "../../../../_actions/managerActions"
import {GetIncommingNews , GetMyNews} from "../../../../_actions/newsActions"

class Home extends React.Component {

    state = {loading : false, activeStream: { url: 'ewfewf' }}

    componentDidMount = async () =>{
            this.setState({loading: true})
            await this.props.GetActiveStream(this.props.user.token);
            await this.props.getManagerDashboardInfo(this.props.user.token);
            await this.props.GetIncommingNews(this.props.user.token);
            await this.props.GetMyNews(this.props.user.token);
            this.setState({loading: false})
    }
    
    render() {
        if(this.state.loading) loading('w-10 text-grayish centerize')
        return (
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 py-6">
                <div>
                    {this.props.activeStream ? 
                    <div className="mb-4 flex flex-row-reverse items-center justify-evenly">
                        <p className="text-white">{this.props.activeStream.streamName}</p>
                        <Link 
                            className="py-2 px-6 rounded-lg bg-greenish text-white" 
                            to={`/stream`}>
                            پیوستن به همایش
                        </Link>
                    </div> 
                    : 
                    null
                    }
                    <Feed
                        news={this.props.inNews}
                        title={this.props.t('managerNewsTitle')}
                        pos="sm:row-start-1 row-start-2"
                    />
                </div>
                <div className="">
                    {(this.props.dashboardInfo.school
                            ?
                            <Hero userInfo={this.props.user.userInformation}
                            
                                  managerTitle={(this.props.dashboardInfo && this.props.dashboardInfo.school && this.props.user.userDetail ? 
                                                    ` ${this.props.t('schoolManager')} ${this.props.user.userDetail.schooltypeName} 
                                                    ${this.props.dashboardInfo.school.sexuality == 0 ? this.props.t('feminine') : this.props.t('masculine')}  
                                                    ${this.props.dashboardInfo.school.schoolName}`
                                                : null)}
                                  adminTitle={`${this.props.t('type')} : ${this.props.user.userDetail.schooltypeName} `}/>
                            :
                            <Hero userInfo={this.props.t('loading')}
                                  title={this.props.t('loading')}
                                  ShowServiceType = {false} />
                    )}
                    <div className="mt-8">
                        <CounterCard
                            title={this.props.t('allClasses')}
                            icon={home}
                            number={this.props.dashboardInfo.classCount}
                            bg="bg-sky-blue"
                        />

                        <CounterCard
                            title={this.props.t('onlineClasses')}
                            icon={user}
                            number={this.props.dashboardInfo.onlineClass}
                            bg="bg-purplish"
                        />

                        <CounterCard
                            title={this.props.t('teachers')}
                            icon={users}
                            number={this.props.dashboardInfo.teacherCount}
                            bg="bg-redish"
                            pos="row-start-3"
                        />

                        <CounterCard
                            title={this.props.t('students')}
                            icon={key}
                            number={this.props.dashboardInfo.studentsCount}
                            bg="bg-greenish"
                            pos="row-start-3"
                        />
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , 
            inNews : state.newsData.incomeNews , 
            myNews : state.newsData.myNews , 
            dashboardInfo : state.managerData.dashboardInfo,
            activeStream : state.streamData.activeStream}
}

const cwrapped = connect(mapStateToProps, { GetIncommingNews , GetMyNews  , getManagerDashboardInfo , GetActiveStream})(Home);

export default withTranslation()(cwrapped);
