import React from "react";
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {home, key, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import { connect } from "react-redux";
import {GetIncommingNews } from "../../../../_actions/newsActions"
import {GetRecentClass , JoinMeeting } from "../../../../_actions/meetingActions"
import RecentClass from "../../Teacher/RecentClass/RecentClass"

class Home extends React.Component {

    state = {loading : false}

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
        if(this.state.loading) return "درحال بارگداری اطلاعات ..."
        return (
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 py-6">
                <Hero userInfo={this.props.user.userInformation}
                        userDetail={this.props.user.userDetail}
                        title={this.props.user.userInformation.email + " : ایمیل شما" }/>
                <RecentClass
                    onStart={(id) => this.JoinMeeting(id)}
                    student={true}
                    joinList={true}
                    class={this.props.recentClass}
                    title="کلاس های فعال"
                    pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                />

                <Feed
                    news={this.props.inNews}
                    title="آخرین اخبار "
                    pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , inNews : state.newsData.incomeNews, recentClass : state.meetingData.recentClass }
}

export default connect(mapStateToProps, {GetIncommingNews , GetRecentClass , JoinMeeting  })(Home);