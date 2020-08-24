import React from "react";
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {home, key, loading, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import { connect } from "react-redux";
import {getManagerDashboardInfo} from "../../../../_actions/managerActions"
import {GetIncommingNews , GetMyNews} from "../../../../_actions/newsActions"

class Home extends React.Component {

    state = {loading : false}

    componentDidMount = async () =>{
            this.setState({loading: true})
            await this.props.getManagerDashboardInfo(this.props.user.token);
            await this.props.GetIncommingNews(this.props.user.token);
            await this.props.GetMyNews(this.props.user.token);
            this.setState({loading: false})
    }
    
    render() {
        if(this.state.loading) loading('w-10 text-grayish centerize')
        return (
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 py-6">
                <Feed
                    news={this.props.inNews}
                    title="آخرین اخبار مدیر کل برای شما"
                    pos="sm:row-start-1 row-start-2"
                />
                <div className="">
                    {(this.props.dashboardInfo.school
                            ?
                            <Hero userInfo={this.props.user.userInformation}
                            
                                  managerTitle={(this.props.dashboardInfo && this.props.dashboardInfo.school && this.props.user.userDetail ? 
                                                    ` مدیر مدرسه ${this.props.user.userDetail.schooltypeName} 
                                                    ${this.props.dashboardInfo.school.sexuality == 0 ? "دخترانه" : "پسرانه"}  
                                                    ${this.props.dashboardInfo.school.schoolName}`
                                                : null)}
                                  adminTitle={`نوع مدرسه : ${this.props.user.userDetail.schooltypeName} `}/>
                            :
                            <Hero userInfo="درحال بارگذاری ..."
                                  title="درحال بارگذاری ..." />
                    )}
                    <div className="mt-8">
                        <CounterCard
                            title="کل کلاس ها"
                            icon={home}
                            number={this.props.dashboardInfo.classCount}
                            bg="bg-sky-blue"
                        />

                        <CounterCard
                            title="کلاس های آنلاین"
                            icon={user}
                            number={this.props.dashboardInfo.onlineClass}
                            bg="bg-purplish"
                        />

                        <CounterCard
                            title="معلمان"
                            icon={users}
                            number={this.props.dashboardInfo.teacherCount}
                            bg="bg-redish"
                            pos="row-start-3"
                        />

                        <CounterCard
                            title="کل دانش آموزان"
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
    return {user: state.auth.userInfo , inNews : state.newsData.incomeNews , myNews : state.newsData.myNews , dashboardInfo : state.managerData.dashboardInfo}
}

export default connect(mapStateToProps, { GetIncommingNews , GetMyNews  , getManagerDashboardInfo})(Home);