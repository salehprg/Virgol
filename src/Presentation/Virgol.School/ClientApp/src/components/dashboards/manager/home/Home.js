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
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 py-6">
                {(this.props.dashboardInfo.school
                ?
                <Hero userInfo={this.props.user.userInformation}
                    managerTitle={`مدیر مدرسه ${this.props.dashboardInfo.school.schoolName}`}
                    adminTitle={`نوع مدرسه : ${this.props.user.userDetail.schooltypeName} `}/>
                    :
                <Hero userInfo="درحال بارگذاری ..."
                    title="درحال بارگذاری ..." />
                )}
                <CounterCard
                    title="کل کلاس ها"
                    icon={home}
                    number={this.props.dashboardInfo.classCount}
                    border="border-sky-blue"
                />

                <CounterCard
                    title="کلاس های آنلاین"
                    icon={user}
                    number={this.props.dashboardInfo.onlineClass}
                    border="border-purplish"
                />

                <CounterCard
                    title="کل دانش آموزان"
                    icon={key}
                    number={this.props.dashboardInfo.studentsCount}
                    border="border-greenish"
                    pos="row-start-3"
                />

                <CounterCard
                    title="معلمان"
                    icon={users}
                    number={this.props.dashboardInfo.teacherCount}
                    border="border-redish"
                    pos="row-start-3"
                />

                <Feed
                    news={this.props.inNews}
                    title="آخرین اخبار مدیر کل برای شما"
                    pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , inNews : state.newsData.incomeNews , myNews : state.newsData.myNews , dashboardInfo : state.managerData.dashboardInfo}
}

export default connect(mapStateToProps, { GetIncommingNews , GetMyNews  , getManagerDashboardInfo})(Home);