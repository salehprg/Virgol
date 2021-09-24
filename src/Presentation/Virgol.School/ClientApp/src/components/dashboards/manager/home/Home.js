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
import Activation from "./Activation";
import { localizer } from '../../../../assets/localizer';
import history from "../../../../history";

class Home extends React.Component {

    state = {loading : false, activeStream: { url: 'ewfewf' } , userType : ''}

    componentDidMount = async () =>{
            this.setState({loading: true})
            await this.props.GetActiveStream(this.props.user.token);
            await this.props.getManagerDashboardInfo(this.props.user.token);
            await this.props.GetIncommingNews(this.props.user.token);
            await this.props.GetMyNews(this.props.user.token);

            this.setState({loading: false})
            this.setState({userType : this.props.match.url.substring(1,2)})

            // console.log(this.props);
    }

    getExpireDate() {
        const d = new Date(this.props.dashboardInfo.school.adobeExpireDate);
        if (d.getFullYear() === 1) {
            return 'قرارداد فعالی وجود ندارد'
        } else {
            return d.toLocaleString('fa-IR').split("،")[0];
        }
    }
    
    render() {
        if(this.state.loading) loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-grid sm:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4 tw-py-6">
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
                        title={this.props.t('managerNewsTitle')}
                        pos="sm:tw-row-start-1 tw-row-start-2"
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
                    <div className="tw-mt-8">

                        {(this.props.dashboardInfo.school && !window.location.href.includes('dei')) ? 
                        <Activation expireDate={this.getExpireDate()} />
                        : 
                        null
                        }
                        {/* <CounterCard
                            title={this.props.t('allClasses')}
                            icon={home}
                            number={this.props.dashboardInfo.classCount}
                            tw-bg="tw-bg-sky-blue"
                        /> */}

<div>
                            <CounterCard
                                title={this.props.t('onlineClasses')}
                                icon={key}
                                number={this.props.dashboardInfo.onlineClass}
                                bg="tw-bg-purplish"
                                link="tracker"
                                userType={this.state.userType}
                            />

                            <CounterCard
                                title={this.props.t('teachers')}
                                icon={user}
                                number={this.props.dashboardInfo.teacherCount}
                                bg="tw-bg-redish"
                                pos="tw-row-start-3"
                                link="teachers"
                                userType={this.state.userType}
                            />

                            <CounterCard
                                title={this.props.t('students')}
                                icon={users}
                                number={this.props.dashboardInfo.studentsCount}
                                bg="tw-bg-greenish"
                                pos="tw-row-start-3"
                                link="students"
                                userType={this.state.userType}
                            />
                        </div>

                        {/* {
                            this.state.userType ?
                            <div>
                            <CounterCard
                                title={this.props.t('onlineClasses')}
                                icon={key}
                                number={this.props.dashboardInfo.onlineClass}
                                bg="tw-bg-purplish"
                                link="tracker"
                                userType={this.state.userType}
                            />

                            <CounterCard
                                title={this.props.t('teachers')}
                                icon={user}
                                number={this.props.dashboardInfo.teacherCount}
                                bg="tw-bg-redish"
                                pos="tw-row-start-3"
                                link="teachers"
                                userType={this.state.userType}
                            />

                            <CounterCard
                                title={this.props.t('students')}
                                icon={users}
                                number={this.props.dashboardInfo.studentsCount}
                                bg="tw-bg-greenish"
                                pos="tw-row-start-3"
                                link="students"
                                userType={this.state.userType}
                            />
                        </div>

                        : 
                        loading('tw-text-grayish tw-w-12 tw-ml-40')
                        } */}
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
