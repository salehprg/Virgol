import React from "react";
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {home, key, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import { connect } from "react-redux";
import {GetIncommingNews } from "../../../../_actions/newsActions"

class Home extends React.Component {

    state = {loading : false}

    componentDidMount = async () =>{
            this.setState({loading: true})
            await this.props.GetIncommingNews(this.props.user.token);
            this.setState({loading: false})
    }
    
    render() {
        if(this.state.loading) return "درحال بارگداری اطلاعات ..."
        return (
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 py-6">
                <Hero userInfo={this.props.user.userInformation}
                        userDetail={this.props.user.userDetail}/>
                <CounterCard
                    title="مقطع"
                    icon={home}
                    number={this.props.dashboardInfo.classCount}
                    border="border-sky-blue"
                />

                <CounterCard
                    title="پایه"
                    icon={user}
                    number={this.props.dashboardInfo.onlineClass}
                    border="border-purplish"
                />

                <CounterCard
                    title="تعداد کل دروس"
                    icon={key}
                    number={this.props.dashboardInfo.studentsCount}
                    border="border-greenish"
                    pos="row-start-3"
                />

                <CounterCard
                    title="معدل"
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

export default connect(mapStateToProps, { GetIncommingNews  })(Home);