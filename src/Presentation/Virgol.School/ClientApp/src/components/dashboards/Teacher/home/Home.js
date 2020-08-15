import React from "react";
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {home, key, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import RecentClass from "../RecentClass/RecentClass";
import { connect } from "react-redux";
import {GetMeetingList , GetRecentClass , StartMeeting , JoinMeeting } from "../../../../_actions/meetingActions"

class Home extends React.Component {

    state = {loading : false}

    componentDidMount = async () =>{
            this.setState({loading: true})
            await this.props.GetMeetingList(this.props.user.token);
            await this.props.GetRecentClass(this.props.user.token);
            this.setState({loading: false})
    }

    StatrMeeting = async(id) => {

        await this.props.StartMeeting(this.props.user.token , id)
        this.componentDidMount()
        this.render()
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
                        userDetail={this.props.user.userDetail}/>
                
                <RecentClass
                    onStart={(id) => this.StatrMeeting(id)}
                    joinList={false}
                    teacher={true}
                    class={this.props.recentClass}
                    title="کلاس های پیش رو"
                    pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                />
                <RecentClass
                    onStart={(id) => this.JoinMeeting(id)}
                    joinList={true}
                    teacher={true}
                    class={this.props.meetingList}
                    title="کلاس های فعال"
                    pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                />
                
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , meetingList : state.meetingData.meetingList , recentClass : state.meetingData.recentClass }
}

export default connect(mapStateToProps, { GetMeetingList , GetRecentClass , StartMeeting , JoinMeeting  })(Home);